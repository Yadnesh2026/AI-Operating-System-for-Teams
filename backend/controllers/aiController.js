const TeamModel = require("../model/TeamModel");
const teamMembership = require("../model/TeamMembership");
const Project = require("../model/ProjectModel");
const TaskModel = require("../model/TaskModel")

const { generateTasks, askProjectAssistant } = require("../services/groqService");
const TeamMembership = require("../model/TeamMembership");

// Task Generator
const generateProjectTasks = async(req, res, next)=>{
    try{
        // Get the Id from URl
        const userId = req.user.id
        const {projectId, teamId} = req.params

        // Check if the team exist
        const team = await TeamModel.findById(teamId)
        if(!team){
            return res.status(400).json({
                message: "Team does not exist"
            })
        }

        // User is a manager of that team or not
        const manager = await teamMembership.findOne({
            teamId: teamId,
            userId: userId,
            role: "manager"
        })
        if(!manager){
            return res.status(400).json({
                message: "You are not the manager of this team"
            })
        }

        const project = await Project.findOne({
            _id: projectId,
            teamId: teamId
        })
        if(!project){
            return res.status(400).json({
                message: "Project does not belong to this team"
            })
        }

        // Assign the task from ai
        const task =  await generateTasks(
            project.name,
            project.description
        );

        res.status(200).json({
            message: "AI Tasks generated successfully",
            task
        })

    }catch(err){
        next(err)
    }
}


// AI Project Assistant
const askProjectQuestions = async(req, res)=>{
    try{
        const {teamId, projectId} = req.params;
        const {userQuestion} = req.body;
        const userId = req.user.id;

        // Vaslidate a Question user put or not
        if(!userQuestion || !userQuestion.trim()){
            return res.status(400).json({
                message: "Please enter a question"
            })
        }

        const project = await Project.findOne({
            _id:projectId,
            teamId: teamId
        })
        if(!project){
            return res.status(400).json({
                message: "Project does not belong to this team"
            })
        }

        const team = await TeamMembership.findOne({
            userId: userId, teamId: teamId
        })
        if(!team){
            return res.status(400).json({
                message :"You does not belong to this team"
            })
        }

        const task = await TaskModel.find({
            projectId: projectId
        })

        const completedTasks = task.filter(
            (task)=> task.status === "completed"
        );

        const pendingTasks = task.filter(
            (task) => task.status === "todo"
        );

        const inProgress = task.filter(
            (task) => task.status === "in-progress"
        )

        const totalTasks = task.length;
        const completedCount = completedTasks.length;
        const pendingCount = pendingTasks.length;
        const inProgressCount = inProgress.length;

        const taskDetails = task.map((item) =>
            `Task Title: ${item.title}, Status: ${item.status}`
        ).join("\n");

        const projectContext = `
        Project name: ${project.name}
        Project Description: ${project.description}
        
        Total Tasks: ${totalTasks}
        Completed Tasks: ${completedCount}
        Pending Tasks: ${pendingCount}
        In Progress Tasks: ${inProgressCount}
        
        Task Details: ${taskDetails}`

        const showData = await askProjectAssistant(
            projectContext,
            userQuestion
        )

        res.status(200).json({
            message: "Data send to Groq",
            showData
        })

    }catch(err){
        console.log("AI Assistant Error",err);
        res.status(500).json({
            message: "Something went wrong"
        })
    }
}


module.exports = {generateProjectTasks, askProjectQuestions}
