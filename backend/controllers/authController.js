const User = require("../model/userModle")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const Session = require("../model/Session");
const crypto = require("crypto");


const loginController =async (req,res,next)=>{
    try{
    const {email, password} = req.body
    if(!email || !password){
        return res.status(401).json({
            message:"Feild required"
        })
    }


    const user = await User.findOne({email})
    if(!user){
        return res.status(401).json({
            message:"You are not an user"
        })
    }

    const compare = await bcrypt.compare(password, user.password)
    if (!compare) {
    return res.status(401).json({
        message: "Invalid email or password"
    });
    }

    // Generate unique session ID For session of devices---------------------------
    const sessionId = crypto.randomUUID();

    // Save session in MongoDB
    await Session.create({
        userId: user._id,
        sessionId,
        device: req.headers["user-agent"] || "Unknown device",
        isActive: true,
        lastActive: new Date()
    }); // -----------------------------------------------------------


    // jwt.sign(payload, secret, options)
    const token = jwt.sign(
        {id:user._id, sessionId},
        process.env.JWT_SECRET,
        {expiresIn: "1d"}
    )

    res.status(200).json({
        message:"Login successfully",
        token,
        user:{
            name: user.name,
            email:user.email
        }
    })

    }catch(err){
        next(err)
    }
}


//Get the profile
const profile = async(req,res,next)=>{
    try{
        const id = req.user.id
        const user = await User.findById(id).select("-password")
        if(!user){
            return res.status(404).json({
                success: false,
                message: "User does not exist"
            })
        }

        res.status(200).json({
            success: true,
            message: "User's Profile",
            user:{
                userId: user._id,
                name: user.name,
                email: user.email,
                profilePhoto: user.profilePhoto
            }
        })

    }catch(err){
        next(err)
    }

}

// Change password controller
const changePassword = async (req, res, next )=>{
    try{
        const {currentPassword, newPassword} = req.body
        const user = await User.findById(req.user.id)

        if(!user){
            return res.status(400).json({
                message: "You are not the user"
            })
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password)

        if(!isMatch){
            return res.status(400).json({
                message: "Current password is incorrect"
            })
        }

        const hashedPass = await bcrypt.hash(newPassword,10)

        user.password = hashedPass

        await user.save()
        return res.status(200).json({
            message: "Password changed successfully"
        })
    }catch(err){
        next(err)
    }
}

const getActiveSessions = async (req, res, next) => {
    try {
        const sessions = await Session.find({
            userId: req.user.id,
            isActive: true
        }).sort({ lastActive: -1 });

        res.status(200).json({
            success: true,
            sessions: sessions.map(session => ({
                _id: session._id,
                device: session.device,
                lastActive: session.lastActive,
                createdAt: session.createdAt,
                isCurrent: session.sessionId === req.user.sessionId
            }))
        });

    } catch (err) {
        next(err);
    }
};

const revokeSession = async (req, res, next) => {
    try {  // If you click Sign out next to Safari, we should change that session's isActive value to false.
        const { sessionId } = req.params;

        const session = await Session.findOne({
            _id: sessionId,
            userId: req.user.id,
            isActive: true
        });

        if (!session) {
            return res.status(404).json({
                message: "Session not found or already revoked"
            });
        }

        // Prevent revoking the current session
        if (session.sessionId === req.user.sessionId) {
            return res.status(400).json({
                message: "You cannot revoke your current session here"
            });
        }

        session.isActive = false;
        await session.save();

        return res.status(200).json({
            message: "Device signed out successfully"
        });

    } catch (err) {
        next(err);
    }
};



module.exports = {loginController, profile, changePassword, getActiveSessions, revokeSession}
