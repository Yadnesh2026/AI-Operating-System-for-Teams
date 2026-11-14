const TeamModel = require("../model/TeamModel")
const teamMembership = require("../model/TeamMembership")
const Project = require("../model/ProjectModel")
const TaskModel = require("../model/TaskModel")
const {redisClient} =require("../config/redis")
const notificationQueue = require("../queues/notificationQueue")

const createTask = async(req,res, next)=>{
    try{
        const {title, description, status, assignedTo} = req.body
        const user = req.user.id
        const teamId = req.params.teamId
        const projectId = req.params.projectId

        const cacheKey = `tasks:${teamId}:${projectId}`

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

        // BullMQ queu added 
        const job = await notificationQueue.add("task-assigned",{ //adds a job to the queue.
            taskId: createTask._id,
            assignedTo: assignedTo,
            assignedBy: user
        })
        console.log("Job added succesfully",job.id);

        // Redis Invalidation
        await redisClient.del(cacheKey)

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

       // Redis implementation
    const cacheKey = `tasks:${teamId}:${projectId}`
    const cacheTasks = await redisClient.get(cacheKey)
    if(cacheTasks){
        const task = JSON.parse(cacheTasks)

        return res.status(200).json({
            message: "All Task of this project listed",
            source: "redis",
            tasks: task
        })
    }

    //fetch all projects
    const allTask = await TaskModel.find({projectId: projectId}).populate("assignedTo","name")

    // Redis store this data - CACHE MISS
    await redisClient.set(cacheKey, JSON.stringify(allTask),{
        EX:60
    })

    if (allTask.length === 0) {
    return res.status(200).json({
        message: "No tasks found for this project",
        source: "mongodb",
        tasks: []
    });
}

    return res.status(200).json({
        message: "All tasks",
        source: "mongodb",
        tasks: allTask
    });


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

   const cacheKey = `tasks:${teamId}:${projectId}`

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

    const updateData = {};

    if (title !== undefined) {
        updateData.title = title;
    }

    if (description !== undefined) {
        updateData.description = description;
    }

    if (status !== undefined) {
        updateData.status = status;
    }

    if (assignedTo !== undefined) {
        updateData.assignedTo = assignedTo;
    }

    const updateTask = await TaskModel.findOneAndUpdate({_id:taskId, projectId:projectId},{
       updateData
    }, { returnDocument: 'after', runValidators: true })

    await redisClient.del(cacheKey)

    res.status(200).json({
        message: "Task Updated",
        updateTask
    })

    }catch(err){
        next(err)
    }
}

const updateStatusByEmployee = async(req, res, next)=>{
    try{
    const {status} = req.body
    const userId=req.user.id
    const teamId = req.params.teamId
    const projectId= req.params.projectId
    const taskId= req.params.taskId

    const cacheKey = `tasks:${teamId}:${projectId}`

    //Check if team consist or not
    const team = await TeamModel.findById(teamId)
    if(!team){
        return res.status(400).json({
            message :"team does not exist"
        })
    }

    // Check if the user is in that team or not
    const user = await teamMembership.findOne({userId: userId, teamId:teamId})
    if(!user){
        return res.status(400).json({
            message: "User does not belongs to this team"
        })
    }
    
    // Check Project is of that team or not
    const project = await Project.findOne({_id: projectId, teamId: teamId})
    if(!project){
        return res.status(400).json({
            message: "Not of this team"
        })
    }

    // Check if the task is of this projet or not
    const task = await TaskModel.findOne({_id: taskId, projectId: projectId})
    if(!task){
        return res.status(400).json({
            message: "Task is not of this project"
        })
    }

    // if(task.assignedTo.toString() !== userId.toString()){
    //     return res.status(403).json({
    //         message : "You are not user of this task"
    //     })
    // }

    // Check loggin user belongs to that task or not
    const checkTaskUser = await TaskModel.findOne({_id: taskId, assignedTo: userId})
    if(!checkTaskUser){
        return res.status(400).json({
            message: "You are not user of this task"
        })
    }

    // Check status is provided
    if (!status) {
        return res.status(400).json({
            message: "Status is required"
        })
    }

    // Update Task Status
    const updateStatus = await TaskModel.findOneAndUpdate({_id:taskId, projectId: projectId},{
        status
    },{returnDocument: 'after', runValidators: true})

    // BullMQ Flow 
    if(status === "completed" && task.status !== "completed"){
        
        await notificationQueue.add("task-completed",{
            taskid: updateStatus._id,
            tasktitle: task.title,
            assignedBy: updateStatus.assignedBy,
            assignedTo: updateStatus.assignedTo
        })
    }
    
    // Redis Delete old data and add the updated
    await redisClient.del(cacheKey)

    res.status(200).json({
        message:"Task Updated",
        updateStatus
    })

    }catch(err){
        next(err)
    }
}

const deleteTask =async(req, res,next)=>{
    try{
    const userId=req.user.id
    const teamId = req.params.teamId
    const projectId= req.params.projectId
    const taskId= req.params.taskId

    //Check if team consist or not
    const team = await TeamModel.findById(teamId)
    if(!team){
        return res.status(400).json({
            message :"team does not exist"
        })
    }

    // Check if the user is in that team or not
    const user = await teamMembership.findOne({userId: userId, teamId:teamId, role: "manager"})
    if(!user){
        return res.status(400).json({
            message: "User does not belongs to this team"
        })
    }
    
    // Check Project is of that team or not
    const project = await Project.findOne({_id: projectId, teamId: teamId})
    if(!project){
        return res.status(400).json({
            message: "Not of this team"
        })
    }

    // Check if the task is of this project or not
    const task = await TaskModel.findOne({_id: taskId, projectId: projectId})
    if(!task){
        return res.status(400).json({
            message: "Task is not of this project"
        })
    }

    // Delete Task
    const deleteT = await TaskModel.findOneAndDelete({_id: taskId , projectId: projectId})

    res.status(200).json({
        message: "Task deleted",
        deleteT
    })

    }catch(err){
        next(err)
    }

}




module.exports ={ createTask,getAllTask,getTaskDetails, updateTask, updateStatusByEmployee,deleteTask}
