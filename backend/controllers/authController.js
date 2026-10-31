const User = require("../model/userModle")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require("dotenv").config()


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

    // jwt.sign(payload, secret, options)
    const token = jwt.sign(
        {id:user._id},
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



module.exports = loginController