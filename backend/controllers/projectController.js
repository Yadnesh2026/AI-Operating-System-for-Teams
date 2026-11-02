const teamMembership = require("../model/TeamMembership")
const Project = require("../model/ProjectModel")

const createProject =async(req,res,next)=>{
    try{
    const {name, description} = req.body
    const user = req.user.id
    const teamId = req.params.teamId

    // Name and description
    if(!name || !description){
        return res.status(400).json({
            message: "Enter the feilds"
        })
    }

    //Only manager can create project
    const manager = await teamMembership.findOne({userId: user, teamId: teamId, role:"manager"})
    if(!manager){
        return res.status(400).json({
            message: "You are not manager of this team"
        })
    }

    // Create the project
    const project = await Project.create({
        name, description, teamId
    })

    res.status(200).json({
        message :"Project Created",
        project
    })
    }catch(err){
        next(err)
    }
}




module.exports = createProject