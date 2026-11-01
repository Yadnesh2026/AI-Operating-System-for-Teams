
const express = require("express")
const router = express.Router()
const {createTeam, getAllTeams, getTeamDetails, addEmployee} = require("../controllers/teamController")
const authMiddleware = require("../middleware/authMiddleware")

//Create a team
router.post("/createteam",authMiddleware,createTeam)

//Get all the team of current manager or user
router.get("/getAllTeams",authMiddleware,getAllTeams)

// Get team details
router.get("/getDetails/:teamId",authMiddleware,getTeamDetails)

// Add employee to the team
router.post("/addEmployee/:teamId/members",authMiddleware,addEmployee)



module.exports = router
