const teamMembership = require("../model/TeamMembership")
const Project = require("../model/ProjectModel")
const TeamModel = require("../model/TeamModel")
const { redisClient } = require("../config/redis")

const createProject =async(req,res,next)=>{
    try{
    const {name, description} = req.body
    const user = req.user.id
    const teamId = req.params.teamId

    //Redis CacheKey
    const CacheKey = `projects:${teamId}`


    // Name and description
    if(!name){
        return res.status(400).json({
            message: "Enter the feilds"
        })
    }

    //Only manager can create project
    const manager = await teamMembership.findOne({userId: user, teamId: teamId, role:"manager"})
    if(!manager){
        return res.status(400).json({
            message: "You are not manager of this team"
        })
    }

    // Create the project
    const project = await Project.create({
        name, description, teamId
    })

    await redisClient.del(CacheKey)  //Delete the cache after the data is change or craeted 

    res.status(200).json({
        message :"Project Created",
        project
    })

    
    }catch(err){
        next(err)
    }
}

const getAllProjects = async(req, res, next)=>{
    try{
    const teamId = req.params.teamId
    const userId = req.user.id

    // Redis part
    const casheKey = `projects:${teamId}`
    const cachedProjects = await redisClient.get(casheKey)

    if(cachedProjects){
        const projects = JSON.parse(cachedProjects) //Convert it to JSON

        return res.status(200).json({
            message: "Cached Project exist",
            projects
        })
    }


    //Check team exist
    const team = await TeamModel.findById(teamId)
    if(!team){
        return res.status(400).json({
            message:"Team does not exist"
        })
    }

    // Check user is of the same team or not
    const user = await teamMembership.findOne({userId:userId, teamId:teamId})
    if(!user){
        return res.status(400).json({
            message:"You are not the user of this team"
        })
    }

    // Fetch the project
    const project = await Project.find({teamId: teamId})


    // Redis part how to fetch the Data when CACHE MISS - Store MongoDB results in Redis
    const storeProject = await redisClient.set(casheKey, JSON.stringify(project),{
        EX: 60 //he cached data expires after 60 seconds.
    })

    if(project.length === 0){ // Its an array thats why project.length === 0
    return res.status(200).json({
        message: "Project does not exist",
        source: "mongoDB"
        })
    }

    res.status(200).json({
        message: "All Project",
        projects: project
    })
    }catch(err){
        next(err)
    }
}

const getOneProjectDetails = async(req, res, next)=>{
    try{
    const teamId = req.params.teamId;
    const projectId = req.params.projectId;
    const userId = req.user.id

    //Check team exist or not
    const team = await TeamModel.findById(teamId)
    if(!team){
        return res.status(400).json({
            message:"Team does not exist"
        })
    }

    // Check user is of the same team or not
    const user = await teamMembership.findOne({userId:userId, teamId:teamId})
    if(!user){
        return res.status(400).json({
            message:"You are not the user of this team"
        })
    }

    // get the Project when user select
    const project = await Project.findOne({ projectId: projectId, teamId: teamId})
    if(!project){
        return res.status(400).json({
            message: "Project does not exist"
        })
    }

    res.status(200).json({
        message: "Project of User Selected",
        project
    })

    }catch(err){
        next(err)
    }
}

const updateProject = async(req, res)=>{
    try{
    const {name, description} = req.body
    const teamId = req.params.teamId
    const projectId = req.params.projectId
    const userId = req.user.id

    //Redis Implementation
    const CacheKey = `projects:${teamId}`

    // Check team exist
    const team = await TeamModel.findById(teamId)
    if(!team){
        return res.status(401).json({
            message: "Team does not exist"
        })
    }

    // Check weather the user(manager) is of same team
    const checkManagar = await teamMembership.findOne({teamId:teamId, userId: userId, role:"manager"})
    if(!checkManagar){
        return res.status(400).json({
            message: "Manager is not of this team"
        })
    }

    // Check weather the project belongs to the team or not
    const checkProject = await Project.findOne({teamId: teamId, _id: projectId})
    if(!checkProject){
        return res.status(400).json({
            message: "Project does not belongs to this team"
        })
    }

    // Update Project
    const project = await Project.findOneAndUpdate({_id:projectId,teamId},{
        name, description
    },{new: true, runValidators: true})

    // Redis deleion of old cache - Redis invalidation
    await redisClient.del(CacheKey)

    res.status(200).json({
        message:"Project Updated",
        project
    })
    }catch(err){
        next(err)
    }
}

const deleteProject = async(req, res)=>{
    try{
    const teamId = req.params.teamId
    const projectId = req.params.projectId
    const userId = req.user.id

    // Redis Implementatuon
    const CacheKey = `projects:${teamId}`

    // Check team exist
    const team = await TeamModel.findById(teamId)
    if(!team){
        return res.status(401).json({
            message: "Team does not exist"
        })
    }

    // Check weather the user(manager) is of same team
    const checkManagar = await teamMembership.findOne({teamId:teamId, userId: userId, role:"manager"})
    if(!checkManagar){
        return res.status(400).json({
            message: "Manager is not of this team"
        })
    }

    // Check weather the project belongs to the team or not
    const checkProject = await Project.findOne({teamId: teamId, _id: projectId})
    if(!checkProject){
        return res.status(400).json({
            message: "Project does not belongs to this team"
        })
    }

    // Delete Project
    const project = await Project.findOneAndDelete({
        _id: projectId,
        teamId: teamId
    })

// Using findOneAndDelete({ _id: projectId, teamId }) ensures that Project B won't be deleted through Team A's route.

    // Redis Invalidation
    await redisClient.del(CacheKey)

    res.status(200).json({
        message: "Project Deleted",
        project
    })
    }catch(err){
        next(err)
    }

}






module.exports = {createProject, getAllProjects, getOneProjectDetails, updateProject, deleteProject}


// redis 
// Get All Projects → MongoDB.
// Get All Projects again → Redis.
// Create a project → Cache invalidated.
// Get All Projects again → MongoDB.
// Update or delete a project → Cache invalidated.


// 1. Get All Projects API – Implement Caching

// Step 1: Import Redis client
// Import redisClient from config/redis.js.

// Step 2: Extract team ID
// Get teamId from req.params.

// Step 3: Create cache key
// const cacheKey = `projects:${teamId}`;
// Use a unique key for each team's projects.

// Step 4: Check Redis
// const cachedProjects = await redisClient.get(cacheKey);

// Step 5: Handle Cache HIT
// - Check whether cached data exists.
// - Convert JSON string into JavaScript array using JSON.parse().
// - Return projects directly from Redis.
// - Do not query MongoDB.

// Step 6: Handle Cache MISS
// If Redis returns null:
// - Fetch projects from MongoDB using Project.find({ teamId }).
// - Store the result in Redis.
// await redisClient.set(cacheKey, JSON.stringify(projects), {
//     EX: 60
// });

// Step 7: Handle empty projects
// Check projects.length === 0 and return an appropriate message.

// Step 8: Return response
// Include source: "mongodb" for Cache MISS and source: "redis" for Cache HIT.

// Important: Perform team and membership authorization checks before returning cached data.

// 2. Create Project – Cache Invalidation
// When a new project is created, the old cached project list becomes outdated.

// Steps:
// 1. Extract teamId.
// 2. Create the same cache key: projects:${teamId}.
// 3. Validate project details.
// 4. Verify manager authorization.
// 5. Create project in MongoDB.
// 6. Delete old Redis cache.
// await redisClient.del(cacheKey);


// 7. Return success response.