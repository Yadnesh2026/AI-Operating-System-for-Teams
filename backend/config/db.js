const mongoose = require("mongoose")
require("dotenv").config()

const connectDB = async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("Mongo is connected")

    }catch(err){
        console.log(err)
    }
}


module.exports = connectDB