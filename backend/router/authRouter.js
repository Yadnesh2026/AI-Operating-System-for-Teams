const express = require("express")
const router = express.Router()
const {loginController, profile, getActiveSessions, revokeSession} = require("../controllers/authController")
const authMiddleware = require("../middleware/authMiddleware")
const rateLimitMiddleware = require("../middleware/rateLimitMiddleware")


//Login User
router.post("/login",rateLimitMiddleware,loginController)

// Profile
router.get("/profile",authMiddleware,profile)

// Active session for an account
router.get("/sessions",authMiddleware,getActiveSessions)

// Revoke the session
router.delete("/sessions/:sessionId", authMiddleware, revokeSession);


// -- Authentication completed --------------






module.exports = router