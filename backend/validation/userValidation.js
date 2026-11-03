const Joi = require("joi")

const userValidation = Joi.object({
    name: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(4).required()
})


module.exports = userValidation