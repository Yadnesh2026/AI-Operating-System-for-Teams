
const express = require("express")
const router = express.Router()
const validate = require("../middleware/validateMiddleware")

const {register, getUser, updateUser, deleteUser} = require("../controllers/userController")
const {profile, changePassword} = require("../controllers/authController")
const userValidation = require("../validation/userValidation")
const authMiddleware = require("../middleware/authMiddleware");

//Create User
router.post("/register",validate(userValidation),register)

//Get he user
router.get("/user/:id",getUser)

//update user
router.put("/user/:id",authMiddleware,updateUser)

//Delete user
router.delete("/user/:id",deleteUser)

// Profile
router.get("/profile", authMiddleware, profile);
router.put("/profile", authMiddleware, updateUser);

// Change Password
router.put("/change-password",authMiddleware,changePassword)




module.exports = router
