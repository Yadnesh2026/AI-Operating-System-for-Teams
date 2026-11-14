const User = require("../model/userModle.js");
const bcrypt = require("bcrypt");

const register = async (req, res, next) => {
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
        message: "User Created",
        user: newUser
    })

    }catch(err){
        next(err)
    }
};


const getUser = async (req, res, next) =>{
    try{
    const id = req.params.id
    const user = await User.findById(id)
    if(!user){
        return res.status(400).json({
            message:"User does not exist"
        })
    }

    res.status(200).json({
        message:"User exist",
        user
    })

    }catch(err){
        next(err)
    }
}

const updateUser = async (req, res, next)=>{
    try{
        const {name, email} = req.body
        const id = req.params.id

        // User.findByIdAndUpdate(id, updateData, options)
        const user = await User.findByIdAndUpdate(id,{
            name,
            email
        },
        {returnDocument: 'after', runValidators: true}  ) 
    
        if(!user){
        return res.status(400).json({
            message:"User does not exist"
        })
        }

        res.status(200).json({
        message:"User updated",
        user
        })

    }catch(err){
        next(err)
    }
}


const deleteUser = async(req,res, next)=>{
    try{
    const id = req.params.id
    const user = await User.findByIdAndDelete(id)

    if(!user){
        return res.status(404).json({
            message: "User not found"
        })
    }

    res.status(200).json({
        message:"User Deleted",
        user
    })
    }catch(err){
        next(err)
    }
}



module.exports ={ register, getUser, updateUser, deleteUser}
