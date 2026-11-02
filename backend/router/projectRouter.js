const express = require("express")
const router = express.Router()
const {createProject,getAllProjects, getOneProjectDetails, updateProject, deleteProject} = require("../controllers/projectController")
const authMiddleware = require("../middleware/authMiddleware")

// Create a project
router.post("/project/:teamId",authMiddleware,createProject)

// Get all projects
router.get("/project/:teamId",authMiddleware,getAllProjects)

// Get details of specfic project
router.get("/project/:teamId/:projetId",authMiddleware,getOneProjectDetails)

// Update details of specific project
router.put("/project/:teamId/:projetId",authMiddleware,updateProject)

// Delete of project
router.delete("/project/:teamId/:projetId",authMiddleware,deleteProject)



module.exports = router