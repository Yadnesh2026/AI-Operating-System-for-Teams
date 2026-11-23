const express = require("express");
const router = express.Router();

const { generateProjectTasks } = require("../controllers/aiController");
const authMiddleware = require("../middleware/authMiddleware")

router.post( "/teams/:teamId/projects/:projectId/generate-tasks",authMiddleware, generateProjectTasks);

module.exports = router;