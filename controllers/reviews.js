const Listing = require("../models/listingSchema");
const Review = require("../models/reviewSchema");

const createReview = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    console.log(res.user);
    const newReview = new Review({...req.body.review, author: req.user._id});

    listing.reviews.push(newReview)

    await listing.save()
    await newReview.save()
    
    req.flash("success", "New Review Created!") // Generating a Flash message
    res.redirect(`/listings/${id}`);
}

const destroyReview = async (req, res) => {
    const { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review Deleted!") // Generating a Flash message

    res.redirect(`/listings/${id}`);
}

module.exports = {createReview, destroyReview}