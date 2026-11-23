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
const notificationRouter = require("./router/notificationRouter");
const aiRouter = require("./router/aiRouter")

require("dotenv").config()


const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:3000,http://localhost:3001,https://redsunai.vercel.app,https://ai-operating-system-for-teams-front.vercel.app")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(cors({
    origin: allowedOrigins
}));
// app.use(helmet()) //Helmet helps protect your backend from common web attacks by setting security headers in HTTP responses.
// app.use(express.json());

// For Profile uplaod size change
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use("/api",userRouter)
app.use("/api", authRouter);
app.use("/api", teamRouter);
app.use("/api", projectRouter);
app.use("/api", taskRouter)
app.use("/api/notifications", notificationRouter);
app.use("/api/ai",aiRouter)


app.get("/",(req, res)=>{
    res.send("Home Page")
})

const startServer =  async()=>{
    try{
        await connectDB()
        await connectRedis()
        const PORT = process.env.PORT || 1000;

        app.listen(PORT,()=>{
            console.log("Server started")
        })

    }catch(err){
        console.log(err)
    }
}

startServer()
