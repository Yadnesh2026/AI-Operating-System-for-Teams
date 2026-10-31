const mongoose = require("mongoose")

const teamMembersShipSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    teamId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Team",
        required: true
    },
    role:{
        type: String,
        enum: ["manager", "employee"],
        required: true
    }
})

const TeamMembership = mongoose.model("TeamMembership", teamMembersShipSchema)

module.exports = TeamMembership