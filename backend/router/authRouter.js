const express = require("express")
const router = express.Router()
const {loginController, profile} = require("../controllers/authController")
const authMiddleware = require("../middleware/authMiddleware")
const rateLimitMiddleware = require("../middleware/rateLimitMiddleware")

//Login User
router.post("/login",rateLimitMiddleware,loginController)

// Profile
router.get("/profile",authMiddleware,profile)


// -- Authentication completed --------------







module.exports = router