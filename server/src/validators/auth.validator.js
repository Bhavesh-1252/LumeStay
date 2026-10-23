import Joi from "joi";

// const usernameSchema = Joi.string()
//   .trim()
//   .pattern(/^[a-zA-Z0-9_.-]{3,30}$/);

const usernameSchema = Joi.string().min(3).max(30).required().messages({
    "string.empty": "{#label} is required",
    "string.min": "{#label} must be at least {#limit} characters",
    "string.max": "{#label} must be at most {#limit} characters",
    "any.required": "{#label} is required",
});

const emailSchema = Joi.string().trim().email().max(254).lowercase().required().messages({
    "string.empty": "{#label} is required",
    "string.email": "Enter a valid email address",
    "string.max": "{#label} must be at least {#limit} characters",
    "any.required": "{#label} is required",
});

const otpSchema = Joi.string().trim().min(6).max(6).required().messages({
    "string.empty": "{#label} is required",
    "string.min": "{#label} must be at least {#limit} characters",
    "string.max": "{#label} must be at least {#limit} characters",
    "any.required": "{#label} is required",
});

const passwordSchema = Joi.string().min(8).max(30).required().messages({
    "string.empty": "{#label} is required",
    "string.min": "{#label} must be at least {#limit} characters",
    "string.max": "{#label} must be at most {#limit} characters",
    "any.required": "{#label} is required",
});

export const registerSchema = Joi.object({
    username: usernameSchema,
    email: emailSchema,
    password: passwordSchema,
})

export const verificationSchema = Joi.object({
    otp: otpSchema,
    email: emailSchema,
})

export const loginSchema = Joi.object({
    identifier: Joi.alternatives()
        .try(usernameSchema, emailSchema).required().messages({
            "alternatives.types": "Email or username must be text",
            "alternatives.match": "Enter a valid email or username",
            "any.required": "Email or username is required",
        }),

    password: passwordSchema,
})

export const forgotPasswordSchema = Joi.object({
    email: emailSchema
})

export const verifyResetOtpSchema = Joi.object({
    email: emailSchema,
    otp: otpSchema,
})