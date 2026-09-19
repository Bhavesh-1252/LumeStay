// PACKAGES
if (process.env.NODE_ENV !== "production")
    require('dotenv').config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const { MongoStore } = require('connect-mongo')
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

// ROUTES
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const User = require("./models/userSchema.js");
const ExpressError = require("./utils/expressError.js")
const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate)
app.use(express.static(path.join(__dirname, "public")))

// DATABASE CONNECTIONS
const dbUrl = process.env.ATLAS_DB_URL
const superSecret = process.env.SESSION_SECRET

async function connectdb() {
    try {
        await mongoose.connect(`${dbUrl}lumestay`)
        console.log("Database connected successfully");
    }
    catch (err) {
        console.log("Error in database connection: ", err);
    }
}

connectdb();

const store = MongoStore.create({

    mongoUrl: `${dbUrl}lumestay`,
    crypto: {
        secret: superSecret,
    },
    touchAfter: 24 * 3600,
})

store.on("error", (err) => {
    console.log("ERROR IN MONGO SESSION STORE: ", err);
});

const sessionOptions = {
    secret: superSecret,
    store,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
}

app.use(session(sessionOptions)) // Create session with sessionOptions
app.use(flash())

app.use(passport.initialize()); //Intializes Passport for incoming requests,
app.use(passport.session()); //Middleware that will restore login state from a session.

passport.use(new LocalStrategy(User.authenticate())); // Authenticates requests through LocalStrategy

passport.serializeUser(User.serializeUser()); // serialize user object into session.
passport.deserializeUser(User.deserializeUser()); // deserialize user objects out of the session.

// Each & Every request pass through this middleware first
app.use((req, res, next) => {
    res.locals.success = req.flash("success"); // using flash message generated when listing created
    res.locals.error = req.flash("error"); // using flash message generated when listing created
    res.locals.currUser = req.user;
    next();
})

// app.get("/demouser", async(req, res) => {
//     const fakeUser = new User({
//         email: "student@gmail.com",
//         username: "delta-student",
//     });

//    const registeredUser = await User.register(fakeUser, "helloworld");
//    res.send(registeredUser);
// })

// Listings Routes
app.use('/listings', listingRouter);

// Reviews Routes
app.use('/listings/:id/reviews', reviewRouter);

// User Routes
app.use('/', userRouter);


// app.get("/testlisting", async (req, res) => {

//     let sampleListing = new Listing({
//         title : "My New Villa",
//         description: "By the beach",
//         price: 1200,
//         location : "Goa",
//         country: "India"
//     })

//     // await sampleListing.save();
//     res.send("tested");
// })

// Error handling
app.all("/{*splat}", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render("error.ejs", { err })
    // res.status(statusCode).send(message)
})

// Server Instance
app.listen(8080, () => {
    console.log("Server is listening at port: 8080");
})