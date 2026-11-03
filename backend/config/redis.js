const Redis = require("redis")

// In simple words, a client is an application or object that communicates with a server to request services or data.
const redisClient = await Redis.createClient({
    url: "redis://localhost:6379"
})

const connectRedis = async()=>{
    try{
        await redisClient.connect()
        console.log("Redis client connected")
    }catch(err){
        console.log("redis client error")
    }
}


module.exports= {connectRedis, redisClient}