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

// Nodemon can reload modules while Mongoose keeps its model registry alive.
// Reuse the registered model on reload instead of compiling it a second time.
const TeamMembership = mongoose.models.TeamMembership || mongoose.model("TeamMembership", teamMembersShipSchema)

module.exports = TeamMembership
