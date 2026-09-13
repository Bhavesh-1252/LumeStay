const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing");
const Review = require("../models/review.js");
const { validateReview, isLoggedIn } = require("../middleware.js");
const router = express.Router({mergeParams: true});
const { isReviewAuthor } = require("../middleware");

// Reviews Routes 


// Create Review
router.post("/", isLoggedIn, validateReview, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    console.log(res.user);
    const newReview = new Review({...req.body.review, author: req.user._id});

    listing.reviews.push(newReview)

    await listing.save()
    await newReview.save()
    
    req.flash("success", "New Review Created!") // Generating a Flash message
    res.redirect(`/listings/${id}`);
}))

// Delete
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review Deleted!") // Generating a Flash message

    res.redirect(`/listings/${id}`);

}))


module.exports = router;