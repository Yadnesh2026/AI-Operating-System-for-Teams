const express = require("express")
const router = express.Router()
const createTask = require("../controllers/taskController")
const authMiddleware = require("../middleware/authMiddleware")

// Create Task
router.post("/task/:teamId/:projectId",authMiddleware,createTask)

module.exports = router