const express = require("express");
const router = express.Router();

const { generateProjectTasks,askProjectQuestions } = require("../controllers/aiController");
const authMiddleware = require("../middleware/authMiddleware")

router.post( "/teams/:teamId/projects/:projectId/generate-tasks",authMiddleware, generateProjectTasks);

router.post("/teams/:teamId/projects/:projectId/ask", authMiddleware, askProjectQuestions);

module.exports = router;
