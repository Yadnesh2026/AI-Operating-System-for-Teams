const teamMembership = require("../model/TeamMembership")
const Project = require("../model/ProjectModel")
const TeamModel = require("../model/TeamModel")

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

const getAllProjects = async(req, res, next)=>{
    try{
    const teamId = req.params.teamId
    const userId = req.user.id

    //Check team exist
    const team = await TeamModel.findById(teamId)
    if(!team){
        return res.status(400).json({
            message:"Team does not exist"
        })
    }

    // Check user is of the same team or not
    const user = await teamMembership.findOne({userId:userId, teamId:teamId})
    if(!user){
        return res.status(400).json({
            message:"You are not the user of this team"
        })
    }

    // Fetch the project
    const project = await Project.find({teamId: teamId})
    if(project.length === 0){ // Its an array thats why project.length === 0
        return res.status(200).json({
            message: "Project does not exist"
        })
    }

    res.status(200).json({
        message: "All Project",
        project
    })
    }catch(err){
        next(err)
    }
}

const getOneProjectDetails = async(req, res, next)=>{
    try{
    const teamId = req.params.teamId;
    const projectId = req.params.projectId;
    const userId = req.user.id

    //Check team exist or not
    const team = await TeamModel.findById(teamId)
    if(!team){
        return res.status(400).json({
            message:"Team does not exist"
        })
    }

    // Check user is of the same team or not
    const user = await teamMembership.findOne({userId:userId, teamId:teamId})
    if(!user){
        return res.status(400).json({
            message:"You are not the user of this team"
        })
    }

    // get the Project when user select
    const project = await Project.findOne({ projectId: projectId, teamId: teamId})
    if(!project){
        return res.status(400).json({
            message: "Project does not exist"
        })
    }

    res.status(200).json({
        message: "Project of User Selected",
        project
    })

    }catch(err){
        next(err)
    }
}

const updateProject = async(req, res)=>{
    try{
    const {name, description} = req.body
    const teamId = req.params.teamId
    const projectId = req.params.projectId
    const userId = req.user.id

    // Check team exist
    const team = await TeamModel.findById(teamId)
    if(!team){
        return res.status(401).json({
            message: "Team does not exist"
        })
    }

    // Check weather the user(manager) is of same team
    const checkManagar = await teamMembership.findOne({teamId:teamId, userId: userId, role:"manager"})
    if(!checkManagar){
        return res.status(400).json({
            message: "Manager is not of this team"
        })
    }

    // Check weather the project belongs to the team or not
    const checkProject = await Project.findOne({teamId: teamId, projectId: projectId})
    if(!checkProject){
        return res.status(400).json({
            message: "Project does not belongs to this team"
        })
    }

    // Update Project
    const project = await Project.findOneAndUpdate(projectId,{
        name, description
    },{new: true, runValidators: true})

    res.status(200).json({
        message:"Project Updated",
        project
    })
    }catch(err){
        next(err)
    }
}

const deleteProject = async(req, res)=>{
    try{
    const teamId = req.params.teamId
    const projectId = req.params.projectId
    const userId = req.user.id

    // Check team exist
    const team = await TeamModel.findById(teamId)
    if(!team){
        return res.status(401).json({
            message: "Team does not exist"
        })
    }

    // Check weather the user(manager) is of same team
    const checkManagar = await teamMembership.findOne({teamId:teamId, userId: userId, role:"manager"})
    if(!checkManagar){
        return res.status(400).json({
            message: "Manager is not of this team"
        })
    }

    // Check weather the project belongs to the team or not
    const checkProject = await Project.findOne({teamId: teamId, _id: projectId})
    if(!checkProject){
        return res.status(400).json({
            message: "Project does not belongs to this team"
        })
    }

    // Delete Project
    const project = await Project.findOneAndDelete({
        _id: projectId,
        teamId: teamId
    })

// Using findOneAndDelete({ _id: projectId, teamId }) ensures that Project B won't be deleted through Team A's route.

    res.status(200).json({
        message: "Project Deleted",
        project
    })
    }catch(err){
        next(err)
    }

}






module.exports = {createProject, getAllProjects, getOneProjectDetails, updateProject, deleteProject}