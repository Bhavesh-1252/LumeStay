import express from "express"

import authControllers from "../controllers/auth.controller.js";
import { forgotPasswordLimiter, otpCheckerLimiter, validateForgotPassword, validateLogin, validateRegisteration, validateVerification, validateVerifyResetOtp } from "../middleware.js";

const authRouter = express.Router();

authRouter.post("/register", validateRegisteration, authControllers.registerUserController)

authRouter.post("/verify", validateVerification, authControllers.verifyUserController);

authRouter.post("/login", validateLogin, authControllers.loginUserController)

authRouter.post("/logout", authControllers.logoutUserController)

authRouter.post("/logout-all", authControllers.logoutAllUserController)

authRouter.post("/rotate-token", authControllers.rotateToken)

authRouter.get("/get-me", authControllers.getMe)

authRouter.post("/forgot-password", forgotPasswordLimiter, validateForgotPassword, authControllers.forgotPassword);

authRouter.post("/verify-reset-code", otpCheckerLimiter, validateVerifyResetOtp, authControllers.verifyResetOtp);

export default authRouter;