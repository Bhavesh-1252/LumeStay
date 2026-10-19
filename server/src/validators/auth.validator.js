import Joi from "joi";

export const registerSchema = Joi.object({
    register: Joi.object({
        username: Joi.string().min(3).max(30).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(8).max(30).required(),
    })
})

export const forgotPasswordSchema = Joi.object({
    email: Joi.string().trim()
        .lowercase()
        .email({ tlds: { allow: false } })
        .required()
})

