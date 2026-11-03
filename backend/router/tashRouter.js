const express = require("express")
const router = express.Router()
const {createTask, getAllTask,getTaskDetails,updateTask,updateStatusByEmployee,deleteTask} = require("../controllers/taskController")
const authMiddleware = require("../middleware/authMiddleware")

// Create Task
router.post("/task/:teamId/:projectId",authMiddleware,createTask)

// Get all task
router.get("/task/:teamId/:projectId",authMiddleware,getAllTask)

// Get task Details
router.get("/task/:teamId/:projectId/:taskId",authMiddleware,getTaskDetails)

// Update the task
router.put("/task/:teamId/:projectId/:taskId",authMiddleware,updateTask)

// Update status of task from employee
router.patch("/task/:teamId/:projectId/:taskId/assign",authMiddleware,updateStatusByEmployee)

// Delete task
router.delete("/task/:teamId/:projectId/:taskId",authMiddleware,deleteTask)

module.exports = router