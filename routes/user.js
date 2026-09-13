const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const User = require("../models/user");
const router = express.Router();
const passport = require("passport");
const { isLoggedIn, saveRedirectUrl } = require("../middleware");

router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
})

router.post('/signup', wrapAsync(async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const user = new User({
            username, email
        });

        const registeredUser = await User.register(user, password);
        console.log(registeredUser);

        req.login(registeredUser, (err) => { // If user register successfully, it automatically login
            if (err) return next(err);
            req.flash("success", "Welcome to WanderLust!");
            res.redirect("/listings");
        })
    } catch (error) {
        req.flash("error", error.message);
        res.redirect("/signup");
    }
}))


router.get("/login", (req, res) => {
    res.render("users/login.ejs");
})

router.post('/login',
    saveRedirectUrl,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true
    }),
    wrapAsync(async (req, res) => {
        req.flash("success", "Welcome back to WonderLust!");
        let redirectUrl = res.locals.redirectUrl || "/listings" // callback or redirect URL
        res.redirect(redirectUrl);
    }))

router.get("/logout", isLoggedIn, (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "Logged Out!");
        return res.redirect("/listings");
    })
})

module.exports = router;