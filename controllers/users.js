const User = require("../models/userSchema");

const getSignup = (req, res) => {
    res.render("users/signup.ejs");
}

const signupUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const user = new User({
            username, email
        });

        const registeredUser = await User.register(user, password);
        // console.log(registeredUser);

        req.login(registeredUser, (err) => { // If user register successfully, it automatically login
            if (err) return next(err);
            req.flash("success", "Welcome to WanderLust!");
            res.redirect("/listings");
        })
    } catch (error) {
        req.flash("error", error.message);
        res.redirect("/signup");
    }
}

const getLogin = (req, res) => {
    res.render("users/login.ejs");
}

const loginUser = async (req, res) => {
    req.flash("success", "Welcome back to WonderLust!");
    let redirectUrl = res.locals.redirectUrl || "/listings" // callback or redirect URL
    res.redirect(redirectUrl);
}

const logoutUser = (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "Logged Out!");
        return res.redirect("/listings");
    })
}

module.exports = {
    getSignup,
    signupUser,
    getLogin,
    loginUser,
    logoutUser
}