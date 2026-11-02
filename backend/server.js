const express = require("express")
const app = express()
const cors = require("cors")
const connectDB = require("./config/db")
const userRouter = require("./router/userRouter")
const authRouter = require("./router/authRouter");
const teamRouter = require("./router/teamRouter")
const projectRouter = require("./router/projectRouter")

require("dotenv").config()


app.use(cors());
app.use(express.json());
app.use("/api",userRouter)
app.use("/api", authRouter);
app.use("/api", teamRouter);
app.use("/api", projectRouter);


app.get("/",(req, res)=>{
    res.send("Home Page")
})

const startServer =  async()=>{
    try{
        await connectDB()
        
        app.listen(1000,()=>{
            console.log("Server started")
        })

    }catch(err){
        console.log(err)
    }
}

startServer()