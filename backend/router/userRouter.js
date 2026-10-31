
const express = require("express")
const router = express.Router()

const {register, getUser, updateUser, deleteUser} = require("../controllers/userController")

//Create User
router.post("/register",register)

//Get he user
router.get("/user/:id",getUser)

//update user
router.put("/user/:id",updateUser)

//Delete user
router.delete("/user/:id",deleteUser)


module.exports = router
