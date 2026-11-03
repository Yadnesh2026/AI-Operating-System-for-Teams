const Joi = require("joi")

const taskValidation = Joi.object({
    title: Joi.string().min(2).required(),
    description: Joi.string().max(500).optional(),
    assignedTo: Joi.string().hex().length(24).required(),
    status: Joi.string().valid("todo","in-progress","completed").optional()
})

const updateTaskValidation = Joi.object({
    title: Joi.string().min(2).optional(),
    description: Joi.string().max(500).optional(),
    assignedTo: Joi.string().hex().length(24).optional(),
    status: Joi.string().valid("todo","in-progress","completed").optional()
}).or("title","description","assignedTo","status")

module.exports = {taskValidation,updateTaskValidation}