const Listing = require("./models/listingSchema");
const Review = require("./models/reviewSchema");
const { listingSchema, reviewSchema } = require("./schema");
const ExpressError = require("./utils/expressError");

const isLoggedIn = (req, res, next) => {
    // console.log(req.path, "..", req.originalUrl);
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl; // redirect URL or callback URL
        req.flash("error", "Login to create listing!");
        return res.redirect("/login");
    }

    next();
}

const saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }

    next();
}

const isOwner = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error", "User is not authorized");
        return res.redirect(`/listings/${id}`)
    }
    next();
}

const isReviewAuthor = async (req, res, next) => {
    const {id, reviewId } = req.params;
    const review = await Review.findById(reviewId);

    if (!review.author._id.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not authorized");
        return res.redirect(`/listings/${id}`)
    }
    next();
}

const validateListing = (req, res, next) => {
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

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);

    if (error) {
        const errorMsg = error.details.map(el => el.message).join(',');
        console.log(error);
        throw new ExpressError(400, errorMsg);
    }
    else
        next();
}

module.exports = { isLoggedIn, saveRedirectUrl, isOwner, validateListing, validateReview, isReviewAuthor };