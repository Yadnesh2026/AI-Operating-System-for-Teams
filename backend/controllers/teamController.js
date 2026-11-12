const TeamModel = require("../model/TeamModel")
const teamMembership = require("../model/TeamMembership")
const User = require("../model/userModle")
const mongoose = require("mongoose")
const { redisClient } = require("../config/redis")
const notificationQueue = require("../queues/notificationQueue");

// Create a team and make the logged-in user its manager.

// Create team.
// Save team.
// Create membership using creatorId, the newly created team's ID, and "manager".
// Return the response.

const createTeam = async(req, res, next)=>{

    try{
    const {name, description} = req.body
    const creatorId = req.user.id

    // Match getAllTeams so the next list request fetches fresh data.
    const cahcedKey = `teams:${creatorId}`

    if(!name || !description){
        return res.status(400).json({
            message: "Feilds are required"
        })
    }

    // Save the team details and record who created it.
    const newTeam = new TeamModel({
        name,
        description,
        createdBy:creatorId
    })

    await newTeam.save()

     // Add the creator to the team with manager permissions.
     const newTeamMembership = await teamMembership.create({
        userId: creatorId,
        teamId: newTeam._id,
        role: "manager"
    })

    // Remove any cached team list so the new team appears immediately.
    await redisClient.del(cahcedKey)


    res.status(200).json({
        message: "Team Created",
        team: newTeam,
        membership: newTeamMembership
    })
    }catch(err){
        next(err)
    }
}


// Get the teams that belong to the logged-in user.
const getAllTeams = async(req,res, next)=>{
    try{
        const id = req.user.id

        // Return the cached list when available to avoid querying MongoDB again.
        const cahcedKey = `teams:${id}`
        const cachedTeam = await redisClient.get(cahcedKey)

        if(cachedTeam){
            const team = await JSON.parse(cachedTeam)
            
              return res.status(200).json({
                message: "Cached Data exist",
                sources: "redis",
                teams: team
            })
        }

// JSON.stringify() converts a JavaScript array into a JSON string.
// JSON.parse() converts a JSON string back into a JavaScript array.


        // Otherwise, get the user's memberships and include each team's details.
        const search = await teamMembership.find({userId: id}).populate("teamId")

        // Cache the result for 60 seconds; team changes clear this same key.
        const storeData = await redisClient.set(cahcedKey, JSON.stringify(search),{
            EX:60
        })

        if(search.length === 0){
            return res.status(201).json({
                message:"No teams found",
                teams: []
            })
        }

        res.status(200).json({
            message: "team Membership founded",
            teams: search
        })

    }catch(err){
        next(err)
    }
}

// Get Team details - When click on that specfic team
const getTeamDetails = async(req, res, next)=>{
    try{
    const teamId = req.params.teamId
    const userId = req.user.id

    // Find the team 
    const team = await TeamModel.findById(teamId)
    if(!team){
        return res.status(404).json({
            message: "Team does not exist"
        })
    }

    // Confirm the logged-in user belongs to this team before returning its roster.
    const requesterMembership = await teamMembership.findOne({ teamId, userId });
    if(!requesterMembership){
        return res.status(403).json({
            message: "Members does not exist"
        })
    }

    // Return every member, not just the logged-in user's membership record.
    const membership = await teamMembership.find({ teamId }).populate("userId");

    // Return details
    res.status(200).json({
        message: "Team Details successfull",
        team: team,
        requesterRole: requesterMembership.role,
        membership: membership
    })

    }catch(err){
        next(err)
    }
}


// Add employee to the team
const addEmployee = async(req, res, next)=>{
    try{
        const teamId = req.params.teamId
        const userId = req.user.id
        const employeeIdentifier = req.body.userId.trim()

        // Redis implimentation
        const cachedKey = `teams:${userId}`
        
        //Check weather the team exist or not
        const team = await TeamModel.findById(teamId)
        if(!team){
            return res.status(404).json({
                message: "Team does not exist"
            })
        }

        //check weather the logged-In user has manager role
        const manager = await teamMembership.findOne({
            userId: userId, //userId matches the logged-in manager's ID.
            teamId: teamId, //teamId matches the team being accessed to this manager
            role: "manager"
        })
        if(manager == null){
            return res.status(403).json({
                message: "Forbidden"
            })
        }

        // To add the user
        // Accept either a MongoDB user ID or the account email entered in the UI.
        const user = mongoose.Types.ObjectId.isValid(employeeIdentifier)
            ? await User.findById(employeeIdentifier)
            : await User.findOne({ email: employeeIdentifier.toLowerCase() })
        if(!user){
            return res.status(404).json({
                message: "No registered user was found with that email or ID"
            })
        }

        //Check that this user is already in a team or not
        const existingMembership = await teamMembership.findOne({userId: user._id,
            teamId: teamId
        })
        if(existingMembership){
            return res.status(409).json({
                message:"employee is already in a team"
            })
        }

        // Create the team means add that employee in the team
        const addEmployee = await teamMembership.create({
            userId: user._id,
            teamId: teamId,
            role: "employee"
        })

        // BullMQ
        const addEmployeeNotification = await notificationQueue.add(
            "employee-add",
            {
                teamId: teamId,
                teamName: team.name,
                employeeId: user._id,
                addedBy: userId
            }
        )

        //redis changes
        await redisClient.del(cachedKey)

        res.status(201).json({
            message: "employee added",
            employee: addEmployee
        })


    }catch(err){
        next(err)
    }
}


const deleteEmployee = async(req,res,next)=>{
    try{
        const teamId = req.params.teamId;
        const userId = req.params.userId;
        const loggedUser = req.user.id;

        //Check weather the team exist 
        const team = await TeamModel.findById(teamId)
        if(!team){
            return res.status(401).json({
                message:"Team does not exist"
            })
        }

        //Verify that logged-in user has manager role
        const manager = await teamMembership.findOne({userId:loggedUser,teamId: teamId, role:"manager"})
        if(!manager){
            return res.status(400).json({
                message:"You are not a manager"
            })
        }

        // Selected employee belongs to that team or not
        const employee = await teamMembership.findOne({userId:userId, teamId: teamId, role: "employee"})
        if(!employee){
            return res.status(200).json({
                message: "You are not in this team"
            })
        }

        // if he is the employee of the team than delete the employee from the team
        const deleteEmployee = await teamMembership.findOneAndDelete({userId,teamId,role:"employee"})


        res.status(200).json({
            message: "employee deleted Successfully ",
            deleteEmployee
        })
    }catch(err){
        next(err)
    }
}

const updateTeamInfo = async(req,res,next)=>{
    try{
        const teamId =req.params.teamId
        const userId = req.user.id //manager
        const {name, description} = req.body

        const cahcedKey = `teams:${userId}`

        //Check weather the team exist or not
        const team = await TeamModel.findById(teamId)
        if(!team){
            return res.status(400).json({
                message: "team does not exist"
            })
        }

        //Check weathet the userId is the manager of this team
        const checkManager = await teamMembership.findOne({userId: userId, teamId: teamId, role: "manager"})
        if(!checkManager){
            return res.status(400).json({
                message: "You are not the manager of this team"
            })
        }

        // Update the team
        const updateTeam = await TeamModel.findByIdAndUpdate(teamId,{
            name,
            description
        },{new: true, runValidators: true})

        await redisClient.del(cahcedKey)

        res.status(200).json({
            message: "Updated Successfully",
            updateTeam
        })
    }catch(err){
        next(err)
    }
}


// Delete the team by manager
const deleteTeam = async(req,res)=>{
    const teamId = req.params.teamId
    const user = req.user.id

    //Check weather the team exist
    const team = await TeamModel.findById(teamId)
    if(!team){
        return res.status(400).json({
            message: "Team does not exist"
        })
    }

    //check weather the logged-In user is manager of team 
    const checkManager = await teamMembership.findOne({userId: user, teamId: teamId, role: "manager"})
    if(!checkManager){
        return res.status(400).json({
            message: "You are not the manager of this team"
        })
    }

    // Delete the membership first
    const deleteTeamMemberships = await teamMembership.deleteMany({teamId})

    // Delete the team
    const deleteTeam = await TeamModel.findByIdAndDelete(teamId)

    res.status(200).json({
        message: "Deleted team and memberships",
        deleteTeamMemberships,
        deleteTeam
    })
}




module.exports = {createTeam, getAllTeams, getTeamDetails, addEmployee, deleteEmployee, updateTeamInfo, deleteTeam}
