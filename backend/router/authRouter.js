const express = require("express")
const router = express.Router()
const {loginController, profile} = require("../controllers/authController")
const authMiddleware = require("../middleware/authMiddleware")

//Login User
router.post("/login",loginController)

// Profile
router.get("/profile",authMiddleware,profile)




module.exports = router