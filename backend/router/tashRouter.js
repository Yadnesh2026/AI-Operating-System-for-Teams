const express = require("express")
const router = express.Router()
const {createTask, getAllTask,getTaskDetails,updateTask} = require("../controllers/taskController")
const authMiddleware = require("../middleware/authMiddleware")

// Create Task
router.post("/task/:teamId/:projectId",authMiddleware,createTask)

// Get all task
router.get("/task/:teamId/:projectId",authMiddleware,getAllTask)

// Get task Details
router.get("/task/:teamId/:projectId/:taskId",authMiddleware,getTaskDetails)

// Update the task
router.put("/task/:teamId/:projectId/:taskId",authMiddleware,updateTask)

module.exports = router