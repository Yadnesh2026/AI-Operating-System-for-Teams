
const express = require("express")
const router = express.Router()
const validate = require("../middleware/validateMiddleware")

const {register, getUser, updateUser, deleteUser} = require("../controllers/userController")
const userValidation = require("../validation/userValidation")

//Create User
router.post("/register",validate(userValidation),register)

//Get he user
router.get("/user/:id",getUser)

//update user
router.put("/user/:id",updateUser)

//Delete user
router.delete("/user/:id",deleteUser)


module.exports = router
