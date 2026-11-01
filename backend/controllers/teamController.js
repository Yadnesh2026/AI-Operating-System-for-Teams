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

// Get Team details





module.exports = {createTeam, getAllTeams, getTeamDetails}