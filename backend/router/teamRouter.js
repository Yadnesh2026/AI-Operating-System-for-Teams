
const express = require("express")
const router = express.Router()
const createTeam = require("../controllers/teamController")

//Create a team
router.post("/createteam",createTeam)



module.exports = router