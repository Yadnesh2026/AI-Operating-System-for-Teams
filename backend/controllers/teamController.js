const TeamModel = require("../model/TeamModel")
const teamMembership = require("../model/TeamMembership")

//Create an team

// Create team.
// Save team.
// Create membership using creatorId, the newly created team's ID, and "manager".
// Return the response.

const createTeam = async(req, res, next)=>{
    try{
    const {name, description} = req.body
    const creatorId = req.user.id

    if(!name || !description){
        return res.status(400).json({
            message: "Feilds are required"
        })
    }

    const newTeam = new TeamModel({
        name,
        description,
        createdBy:creatorId
    })

    await newTeam.save()

     const newTeamMembership = await teamMembership.create({
        userId: creatorId,
        teamId: newTeam._id,
        role: "manager"
    })


    res.status(200).json({
        message: "Team Created",
        team: newTeam,
        membership: newTeamMembership
    })
    }catch(err){
        next(err)
    }
}


//Get all team for specific user 
const getAllTeams = async(req,res, next)=>{
    try{
        const id = req.user.id
        const search = await teamMembership.find({userId: id}).populate("teamId")
        if(search.length === 0){
            return res.status(201).json({
                message:"No teams found"
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

    //Check weather logged-in user belongs to that team or not 
    const membership = await teamMembership.find({teamId: teamId, userId: userId}).populate("userId");
    if(!membership){
        return res.status(403).json({
            message: "Members does not exist"
        })
    }

    // Return details
    res.status(200).json({
        message: "Team Details successfull",
        team: team,
        membership: membership
    })

    }catch(err){
        next(err)
    }
}


// Add employee to the team
const addEmployee = async(req, res, next)=>{
    try{
        
    }catch(err){
        next(err)
    }
}




module.exports = {createTeam, getAllTeams, getTeamDetails, addEmployee}