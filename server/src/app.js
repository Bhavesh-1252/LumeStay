// PACKAGES
import express from "express"
import config from "./config/config.js"
import cors from "cors"
import cookieParser from "cookie-parser"

// ROUTES
import listingRouter from "./routes/listing.routes.js"
import reviewRouter from "./routes/review.routes.js"
import authRouter from "./routes/auth.routes.js"
import ExpressError from "./services/expressError.js";



const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: config.CLIENT_BASE_URL,
    credentials: true,
}));

// User Routes
app.use('/api/auth', authRouter);

// Listings Routes
app.use('/api/listings', listingRouter);

// Reviews Routes
app.use('/api/listings/:id/reviews', reviewRouter);

// Error handling
app.all("/{*splat}", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;

    if (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError") {
        statusCode = 401;
        message = message || "Invalid access Token";
    }

    if (statusCode === 500) console.log(err);
    const body = {
        success: false,
        message
    }
    if (err.fields) body.fields = err.fields;
    res.status(statusCode).json(body)
})

export default app;