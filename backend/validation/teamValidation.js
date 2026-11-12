const Joi = require("joi")

const teamValidation = Joi.object({
    name: Joi.string().min(2).required(),
    description: Joi.string().max(500).required()
})


const addEmployeeValidation = Joi.object({
    userId: Joi.alternatives().try(
        Joi.string().hex().length(24),
        Joi.string().email()
    ).required()
});

const updateDetailsOfTeam = Joi.object({
    name: Joi.string().min(2),
    description: Joi.string().max(500)
}).or("name", "description");

module.exports = {teamValidation, addEmployeeValidation, updateDetailsOfTeam}
