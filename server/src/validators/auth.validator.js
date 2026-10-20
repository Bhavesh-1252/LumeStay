import Joi from "joi";

// const usernameSchema = Joi.string()
//   .trim()
//   .pattern(/^[a-zA-Z0-9_.-]{3,30}$/);

const usernameSchema = Joi.string().min(3).max(30).required();
const emailSchema = Joi.string().trim().email().lowercase().required();

export const registerSchema = Joi.object({
    usernameSchema,
    emailSchema,
    password: Joi.string().min(8).max(30).required().message(
        
    ),
})

export const verificationSchema = Joi.object({
    otp: Joi.string().trim().min(6).max(6).required(),
})

export const loginSchema = Joi.object({
    identifier: Joi.alternatives()
        .try(usernameSchema, emailSchema).required(),

    password: Joi.string().min(8).max(30).required(),
})

export const forgotPasswordSchema = Joi.object({
    email: Joi.string().trim()
        .lowercase()
        .email({ tlds: { allow: false } })
        .required()
})

