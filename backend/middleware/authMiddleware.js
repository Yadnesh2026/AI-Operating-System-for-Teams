const jwt = require("jsonwebtoken")
require("dotenv").config()

const authMiddleware = ( req, res, next)=>{
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
    req.user =verify;
    next()

    }catch(err){
        next(err)
    }
    
}

module.exports = authMiddleware