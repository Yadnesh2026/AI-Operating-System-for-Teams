const rateLimit = require("express-rate-limit")

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    message:{
        success:false,
        message: "Too many login attempts. Try again later"
    }
})

// Send 5 login requests.
// Send the 6th request within 15 minutes.
// You should receive a 429 Too Many Requests response.

module.exports = loginLimiter