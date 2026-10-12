// PACKAGES
import express from "express"
import path from "path"
import { fileURLToPath } from "url"
import methodOverride from "method-override"
import ejsMate from "ejs-mate"
import session from "express-session"
import { MongoStore } from "connect-mongo"
import flash from "connect-flash"
import passport from "passport"
import LocalStrategy from "passport-local";
import config from "./config/config.js"
import cors from "cors"
import cookieParser from "cookie-parser"

// ROUTES
import listingRouter from "./routes/listing.routes.js"
import reviewRouter from "./routes/review.routes.js"
import authRouter from "./routes/auth.routes.js"

import UserModel from "./models/user.model.js"
import ExpressError from "./utils/expressError.js"
import { isLoggedIn } from "./middleware.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));
/*
 express.urlencoded({ extended: true })  
 Use this middleware when sending data directly from html form 
*/
app.use(express.json())
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "../public")))
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))
// app.use(methodOverride("_method"));
// app.engine("ejs", ejsMate)

// DATABASE CONNECTIONS

const superSecret = config.SESSION_SECRET;
const dbUrl = config.MONGODB_URI;

// const store = MongoStore.create({

//     mongoUrl: `${dbUrl}lumestay`,
//     crypto: {
//         secret: superSecret,
//     },
//     touchAfter: 24 * 3600,
// })

// store.on("error", (err) => {
//     console.log("ERROR IN MONGO SESSION STORE: ", err);
// });

// const sessionOptions = {
//     secret: superSecret,
//     store,
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//         expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
//         maxAge: 7 * 24 * 60 * 60 * 1000,
//         httpOnly: true,
//     }
// }

// app.use(session(sessionOptions)) // Create session with sessionOptions
// app.use(flash())

// app.use(passport.initialize()); //Intializes Passport for incoming requests,
// app.use(passport.session()); //Middleware that will restore login state from a session.

// passport.use(new LocalStrategy(User.authenticate())); // Authenticates requests through LocalStrategy

// passport.serializeUser(User.serializeUser()); // serialize user object into session.
// passport.deserializeUser(User.deserializeUser()); // deserialize user objects out of the session.

// Each & Every request pass through this middleware first
// app.use((req, res, next) => {
//     res.locals.success = req.flash("success"); // using flash message generated when listing created
//     res.locals.error = req.flash("error"); // using flash message generated when listing created
//     res.locals.currUser = req.user;
//     next();
// })

// Listings Routes
app.use('/listings', isLoggedIn, listingRouter);

// Reviews Routes
app.use('/listings/:id/reviews', isLoggedIn, reviewRouter);

// User Routes
app.use('/api/auth', authRouter);

// Error handling
app.all("/{*splat}", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).json({
        message
    })
})

export default app;