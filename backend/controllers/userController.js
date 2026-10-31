const User = require("../model/userModle.js");
const bcrypt = require("bcrypt");

const register = async (req, res) => {
    try{
    const {name, email, password} = req.body

    if(!name || !email || !password){
        return res.status(400).json({
            message: "All fields are required"
        })
    }

    const exisitingUser = await User.findOne({email})
    if(exisitingUser){
        return res.status(400).json({
            message: "User already exist"
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = new User({
        name,
        email,
        password:hashedPassword
    })

    await newUser.save()

    res.status(200).json({
        message: "User Created"
    })

    }catch(err){
        res.status(409).json({
            message: err.message
        })
    }
};



module.exports = register
