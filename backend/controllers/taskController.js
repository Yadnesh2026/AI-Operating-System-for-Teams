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

const getAllTask = async (req,res,next)=>{
    try{
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

    // Verify that User belongs to the team
    const checkUser = await teamMembership.findOne({teamId: teamId, userId: user})
    if(!checkUser){
        return res.status(400).json({
            message: "User does no belongs to this team"
        })
    }

    //Verify that project belongs to this team
    const project = await Project.findOne({teamId: teamId, _id: projectId})
    if(!project){
        return res.status(400).json({
            message: "Project does not belongs to this team"
        })
    }

    //fetch all projects
    const allTask = await TaskModel.find({projectId: projectId})
    if(allTask.length === 0){
        return res.status(400).json({
            message: "Task does not exist"
        })
    }

    res.status(200).json({
        message: "All task",
        allTask
    })


    }catch(err){
        next(err)
    }
}

const getTaskDetails = async(req,res)=>{
    try{
    const userId = req.user.id
    const teamId = req.params.teamId
    const projectId = req.params.projectId
    const taskId = req.params.taskId

    // Find team
    const team = await TeamModel.findById(teamId)
    if(!team){
        return res.status(400).json({
            message: "Team does not exist"
        })
    }

    // Project assign to this team
    const project = await Project.findOne({ _id: projectId,teamId: teamId })
    if(!project){
        return res.status(400).json({
            message: "Project is not of this team"
        })
    }

    // User belongs to this team
    const user = await teamMembership.findOne({userId: userId, teamId: teamId})
    if(!user){
        return res.status(400).json({
            message: "User does not belong to this team"
        })
    }

    // Find the task belongs to this project
    const task = await TaskModel.findOne({projectId: projectId, _id:taskId})

    res.status(200).json({
        message: "Task",
        task
    })

    }catch(err){
        next(err)
    }
}

const updateTask = async(req, res, next)=>{
    try{
    const {title, description,status, assignedTo}= req.body
    const userId=req.user.id
    const teamId = req.params.teamId
    const projectId= req.params.projectId
    const taskId= req.params.taskId

    const team = await TeamModel.findById(teamId)
    if(!team){
        return res.status(400).json({
            message :"team does not exist"
        })
    }

    const user = await teamMembership.findOne({userId: userId, team:teamId, role:"manager"})
    if(!user){
        return res.status(400).json({
            message: "User does not belongs to this team"
        })
    }

    const employeeUser = await teamMembership.findOne({userId: req.body.assignedTo, teamId:teamId, role:"employee"})
    if(!employeeUser){
        return res.status(400).json({
            message: "User does not belongs to this team"
        })
    }

    const project = await Project.findOne({_id:projectId, teamId: teamId})
    if(!project){
        return res.status(400).json({
            message: "Project does not of this team"
        })
    }

    const verifyTask = await TaskModel.findOne({_id:taskId, projectId: projectId})
    if(!verifyTask){
        return res.status(400).json({
            message: "This taks does not belong to this project"
        })
    }

    const updateTask = await TaskModel.findOneAndUpdate({_id:taskId, projectId:projectId},{
        title,
        description,
        assignedTo: employeeUser,
        status
    }, { new: true, runValidators: true })

    res.status(200).json({
        message: "Task Updated",
        updateTask
    })

    
    }catch(err){
        next(err)
    }
}





module.exports ={ createTask,getAllTask,getTaskDetails, updateTask}