
const express = require("express")
const router = express.Router()

const register = require("../controllers/userController")

//Create User
router.post("/register",register)


module.exports = router
