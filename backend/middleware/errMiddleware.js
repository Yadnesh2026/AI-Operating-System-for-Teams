const errMiddleware = (err, req,res,next) =>{

    const statusCode = err.statusCode || 500

    // JSON Web Token error
    if(err.name == "JsonWebTokenError"){
        return res.status(401).json({
            success:false,
            message:err.message
        })
    }

    // JSON Expired Token
    if(err.name == "TokenExpiredError"){
        return res.status(401).json({
            success:false,
            message:err.message
        })
    }

    // CastError
    if (err.name === "CastError") {
    return res.status(400).json({
        success: false,
        message: "Invalid ID format"
    });
    }

    // Status Code
    res.status(statusCode).json({
        success: false,
        message:err.message
    })
}

module.exports = errMiddleware