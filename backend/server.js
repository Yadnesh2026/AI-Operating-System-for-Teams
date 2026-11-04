const express = require("express")
const app = express()
const cors = require("cors")
const connectDB = require("./config/db")
const userRouter = require("./router/userRouter")
const authRouter = require("./router/authRouter");
const teamRouter = require("./router/teamRouter")
const projectRouter = require("./router/projectRouter");
const taskRouter = require("./router/tashRouter")
const helmet = require("helmet")
const {connectRedis, redisClient} = require("./config/redis")
require("./workers/notificationWorker")

require("dotenv").config()


app.use(cors({
    origin: "http://localhost:3000"
}));
app.use(helmet()) //Helmet helps protect your backend from common web attacks by setting security headers in HTTP responses.
app.use(express.json());

app.use("/api",userRouter)
app.use("/api", authRouter);
app.use("/api", teamRouter);
app.use("/api", projectRouter);
app.use("/api", taskRouter)


app.get("/",(req, res)=>{
    res.send("Home Page")
})

const startServer =  async()=>{
    try{
        await connectDB()
        await connectRedis()

        app.listen(1000,()=>{
            console.log("Server started")
        })

    }catch(err){
        console.log(err)
    }
}

startServer()