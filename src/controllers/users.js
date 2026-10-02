import { errors } from "passport-local-mongoose";
import User from "../models/userSchema.js"
import verifyEmail from "../services/email.js";

const getSignup = (req, res) => {
    res.render("users/signup.ejs");
}

// console.log(User.generateVerifyToken());
const signupUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const isExists = await User.findOne({
            $or: [
                { username },
                { email }
            ]
        })

        if (isExists) {
            req.flash("error", "User is already registered!");
            return res.redirect("/signup");
        }

        const user = new User({
            username, email
        });

        const registeredUser = await User.register(user, password);

        const token = registeredUser.generateVerifyToken();

        registeredUser.verificationToken = token;
        registeredUser.save();

        const err = await verifyEmail(email, `${req.protocol}://${req.host}/verify/${token}`);
        if(err) {
            req.flash("error", err);
            return res.redirect("/signup");
        }

        req.flash("success", "Check your email to verify your account");
        return res.redirect("/signup");
    } catch (error) {
        req.flash("error", error.message);
        return res.redirect("/signup");
    }
}

const getLogin = (req, res) => {
    res.render("users/login.ejs");
    // console.log(`${req.protocol}://${req.host}${req.originalUrl}`);
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

const verifyToken = async (req, res) => {
    try {
        const { token } = req.params;

        const user = await User.findOne({
            verificationToken: token,
            verificationTokenExpiry: { $gt: Date.now() }
        })

        if (!user) {
            req.flash('error', "User Not Found!");
            return res.redirect("/signup");
        }

        if (user.isVerified) {
            req.flash("error", "User is already registered!");
            return res.redirect("/signup");
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiry = undefined;
        await user.save();

        req.login(user, (err) => { // If user register successfully, it automatically login
            if (err) return next(err);
            req.flash("success", "Welcome to WanderLust!");
            res.redirect("/listings");
        })
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/login");
    }
}

export {
    getSignup,
    signupUser,
    getLogin,
    loginUser,
    logoutUser,
    verifyToken,
}