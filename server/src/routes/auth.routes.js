import express from "express"

import authControllers from "../controllers/auth.controller.js";
import {forgotPasswordLimiter, otpCheckerLimiter, validate } from "../middlewares/auth.middleware.js";
import authValidatorsSchema from "../validators/auth.validator.js";

const authRouter = express.Router();

authRouter.post("/register", validate(authValidatorsSchema.registerSchema), authControllers.registerUserController)

authRouter.post("/verify", validate(authValidatorsSchema.verificationSchema), authControllers.verifyUserController);

authRouter.post("/resend-verification-otp", validate(authValidatorsSchema.resendVerificationOtpSchema), authControllers.resendVerificationOtp);

authRouter.post("/login", validate(authValidatorsSchema.loginSchema), authControllers.loginUserController)

authRouter.post("/logout", authControllers.logoutUserController)

authRouter.post("/logout-all", authControllers.logoutAllUserController)

authRouter.post("/rotate-token", authControllers.rotateToken)

authRouter.get("/get-me", authControllers.getMe)

authRouter.post("/forgot-password", forgotPasswordLimiter, validate(authValidatorsSchema.forgotPasswordSchema), authControllers.forgotPassword);

authRouter.post("/verify-reset-code", otpCheckerLimiter, validate(authValidatorsSchema.verifyOtpSchema), authControllers.verifyResetOtp);

authRouter.post("/reset-password", otpCheckerLimiter, validate(authValidatorsSchema.resetPasswordSchema), authControllers.resetPassword);

export default authRouter;