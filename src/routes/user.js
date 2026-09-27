import express from "express"
import passport from "passport"
import { getLogin, getSignup, loginUser, logoutUser, signupUser } from "../controllers/users.js";
import { wrapAsync } from "../utils/wrapAsync.js";
import { isLoggedIn, saveRedirectUrl } from "../middleware.js";

const router = express.Router();

router.route("/signup")
    .get(getSignup)
    .post(wrapAsync(signupUser))


router.route("/login")
    .get(getLogin)
    .post(saveRedirectUrl,
        passport.authenticate("local", {
            failureRedirect: "/login",
            failureFlash: true
        }),
        wrapAsync(loginUser))

router.get("/logout", isLoggedIn, logoutUser)

export default router;