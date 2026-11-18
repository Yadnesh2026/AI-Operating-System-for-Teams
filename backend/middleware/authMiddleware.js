const jwt = require("jsonwebtoken")
require("dotenv").config()
const Session = require("../model/Session");

const authMiddleware = async( req, res, next)=>{
    try{
    const token = req.headers.authorization
    if(!token){
        return res.status(401).json({
            success: false,
            message: "token does not exist"
        })
    }
    const tokenExtract = token.split(" ")[1]
    const verify = jwt.verify(tokenExtract, process.env.JWT_SECRET)

    // Session in Middleware for Active Session log -------------------------
    const session = await Session.findOne({
        sessionId: verify.sessionId,
        userId: verify.id,
        isActive: true
    });

    if (!session) {
        return res.status(401).json({
            message: "Session expired or revoked. Please login again."
        });
    }

    session.lastActive = new Date();
    await session.save();
    // -------------------------------------------------------------------------



    req.user =verify;
    next()

    }catch(err){
        next(err)
    }
    
}

module.exports = authMiddleware

// Request
//    ↓
// Verify JWT
//    ↓
// Find session in MongoDB
//    ↓
// Is session active?
//    ├── Yes → Allow access
//    └── No  → Reject request (401)
