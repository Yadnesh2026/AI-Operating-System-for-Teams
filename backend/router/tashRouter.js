const express = require("express")
const router = express.Router()
const {createTask, getAllTask,getTaskDetails,updateTask,updateStatusByEmployee,deleteTask} = require("../controllers/taskController")
const authMiddleware = require("../middleware/authMiddleware")
const {taskValidation,updateTaskValidation} = require("../validation/taskValidation")
const validate = require("../middleware/validateMiddleware")

// Create Task
router.post("/task/:teamId/:projectId",authMiddleware,validate(taskValidation),createTask)

// Get all task
router.get("/task/:teamId/:projectId",authMiddleware,getAllTask)

// Get task Details
router.get("/task/:teamId/:projectId/:taskId",authMiddleware,getTaskDetails)

// Update the task
router.put("/task/:teamId/:projectId/:taskId",authMiddleware,validate(updateTaskValidation),updateTask)

// Update status of task from employee
router.patch("/task/:teamId/:projectId/:taskId/assign",authMiddleware,updateStatusByEmployee)

// Delete task
router.delete("/task/:teamId/:projectId/:taskId",authMiddleware,deleteTask)

module.exports = router