const express = require("express")
const router = express.Router()
const loginController = require("../controllers/authController")
const authMiddleware = require("../middleware/authMiddleware")

//Login User
router.post("/login",loginController)

// router.get("/profile",authMiddleware,getProfile)

router.get("/test",authMiddleware, (req, res)=>{
    res.status(200).json({
        message: "Authentication success",
        user: req.user
    })
})


module.exports = router