import express from "express"

import authControllers from "../controllers/auth.controller.js";
// import { guestOnly, isLoggedIn, saveRedirectUrl } from "../middleware.js";

const authRouter = express.Router();

authRouter.post("/register", authControllers.registerUserController)

authRouter.post("/verify", authControllers.verifyUserController);

authRouter.post("/login", authControllers.loginUserController)

authRouter.post("/logout", authControllers.logoutUserController)

authRouter.post("/logout-all", authControllers.logoutAllUserController)

authRouter.post("/rotate-token", authControllers.rotateToken)

authRouter.get("/get-me", authControllers.getMe)

export default authRouter;