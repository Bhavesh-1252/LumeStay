const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const passport = require("passport");
const { isLoggedIn, saveRedirectUrl } = require("../middleware");
const { getSignup, signupUser, getLogin, loginUser, logoutUser } = require("../controllers/users.js");

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

module.exports = router;