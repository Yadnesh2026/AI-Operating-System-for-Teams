const TeamModel = require("../model/TeamModel");
const teamMembership = require("../model/TeamMembership");
const Project = require("../model/ProjectModel");

const { generateTasks } = require("../services/groqService");

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


module.exports = {generateProjectTasks}
