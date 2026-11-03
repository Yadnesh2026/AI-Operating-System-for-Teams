
const express = require("express")
const router = express.Router()
const {createTeam, getAllTeams, getTeamDetails, addEmployee, deleteEmployee, updateTeamInfo, deleteTeam} = require("../controllers/teamController")
const authMiddleware = require("../middleware/authMiddleware")
const validate =  require("../middleware/validateMiddleware")
const {teamValidation,addEmployeeValidation, updateDetailsOfTeam} = require("../validation/teamValidation")

//Create a team
router.post("/createteam",authMiddleware,validate(teamValidation),createTeam)

//Get all the team of current manager or user
router.get("/getAllTeams",authMiddleware,getAllTeams)

// Get team details
router.get("/getDetails/:teamId",authMiddleware,getTeamDetails)

// Add employee to the team
router.post("/addEmployee/:teamId/members",authMiddleware,validate(addEmployeeValidation),addEmployee)

//Delete Employee
router.delete("/deleteEmployee/:teamId/:userId",authMiddleware,deleteEmployee)

//Update team info by manager
router.put("/updateTeam/:teamId",authMiddleware,validate(updateDetailsOfTeam),updateTeamInfo)

//Delete the team by manager
router.delete("/deleteTeam/:teamId",authMiddleware,deleteTeam)


module.exports = router
