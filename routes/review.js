const express = require("express");
const { reviewSchema } = require("../schema");
const ExpressError = require("../utils/expressError");
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing");
const Review = require("../models/review.js")
const router = express.Router({mergeParams: true});


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

// Reviews Routes 

// Post
router.post("/", validateReview, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    const newReview = new Review(req.body.review);

    listing.reviews.push(newReview)

    await listing.save()
    await newReview.save()
    
    req.flash("success", "New Review Created!") // Generating a Flash message
    res.redirect(`/listings/${id}`);
}))

// Delete
router.delete("/:reviewId", wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review Deleted!") // Generating a Flash message

    res.redirect(`/listings/${id}`);

}))


module.exports = router;