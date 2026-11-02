const TeamModel = require("../model/TeamModel")
const teamMembership = require("../model/TeamMembership")
const Project = require("../model/ProjectModel")
const TaskModel = require("../model/TaskModel")

const createTask = async(req,res, next)=>{
    try{
        const {title, description, status, assignedTo} = req.body
        const user = req.user.id
        const teamId = req.params.teamId
        const projectId = req.params.projectId

        //Check team exist
        const team = await TeamModel.findById(teamId)
        if(!team){
            return res.status(400).json({
                message:"Team does not exist"
            })
        }

        //Only manager can assigned task 
        const manager = await teamMembership.findOne({userId: user, teamId: teamId, role:"manager"})
            if(!manager){
                return res.status(400).json({
                message: "You are not manager of this team"
            })
        }

        //Verify that project belongs to this team
        const project = await Project.findOne({teamId: teamId, _id: projectId})
        if(!project){
            return res.status(400).json({
                message: "Project does not belongs to this team"
            })
        }

        // Verify that assignedTo is actually an employee belonging to that same team.
        const assignedToEmployee = await teamMembership.findOne({userId: req.body.assignedTo, teamId: teamId, role:"employee"})
        if(!assignedToEmployee){
            return res.status(400).json({
                message: "You are not employee of this team"
            })
        }

        //Create task
        const createTask = await TaskModel.create({
            title,
            description,
            status,
            assignedTo,
            assignedBy: user,
            projectId: projectId
        })


        res.status(200).json({
            message: "Task Created",
            createTask
        })

    }catch(err){
        next(err)
    }
}






module.exports = createTask