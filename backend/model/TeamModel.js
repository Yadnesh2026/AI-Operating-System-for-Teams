const mongoose = require("mongoose")

const teamSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
})

const Team = mongoose.model("Team", teamSchema)

module.exports = Team