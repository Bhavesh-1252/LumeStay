import Listing from "./models/listing.model.js";
import Review from "./models/review.model.js";
import { listingSchema, reviewSchema } from "./schema.js";
import ExpressError from "./utils/expressError.js";

export const guestOnly = (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.status(403).json({
            message: "User is already logged in!"
        })
    }
    next();
}

export const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl; // redirect URL or callback URL
        req.flash("error", "Login to create listing!");
        return res.redirect("/login");
    }
    next();
}

export const saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }

    next();
}

export const isOwner = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error", "User is not authorized");
        return res.redirect(`/listings/${id}`)
    }
    next();
}

export const isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);

    if (!review.author._id.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not authorized");
        return res.redirect(`/listings/${id}`)
    }
    next();
}

export const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);

    if (error) {
        const errorMsg = error.details.map(el => el.message).join(',');
        console.log(error);
        throw new ExpressError(400, errorMsg);
    }
    else {
        next();
    }
}

export const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);

    if (error) {
        const errorMsg = error.details.map(el => el.message).join(',');
        console.log(error);
        throw new ExpressError(400, errorMsg);
    }
    else
        next();
}

// export { isLoggedIn, saveRedirectUrl, isOwner, validateListing, validateReview, isReviewAuthor };