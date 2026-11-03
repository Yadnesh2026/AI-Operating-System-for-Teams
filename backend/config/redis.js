const Redis = require("redis")

// In simple words, a client is an application or object that communicates with a server to request services or data.
const redisClient =  Redis.createClient({
    url: "redis://localhost:6379" //redisClient lets other parts of your backend communicate with Redis.
})

const connectRedis = async()=>{ // connectRedis establishes the connection.
    try{
        await redisClient.connect()
        console.log("Redis client connected")
    }catch(err){
        console.log("redis client error",err)
        throw err
    }
}


module.exports= {connectRedis, redisClient}