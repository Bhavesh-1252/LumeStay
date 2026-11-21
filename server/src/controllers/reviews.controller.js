import ListingModel from "../models/listing.model.js";
import ReviewModel from "../models/review.model.js";
import ExpressError from "../services/expressError.js";

/**
 * @name createReview
 * @description Create a new review, require authentication, and expects review object in req.body and listing id in req.params
 * @access Public
 */
const createReview = async (req, res) => {
    const review = req.body;
    const { id: listingId } = req.params;

    const listing = await ListingModel.findById(listingId);
    if (!listing) throw new ExpressError(404, "Review for listing is removed or invalid");

    review.author = req.user.id;
    const newReview = await ReviewModel.create(review);
    await newReview.populate("author", "username");

    await ListingModel.findByIdAndUpdate(listingId, { $push: { reviews: newReview._id } });

    res.status(201).json({
        success: true,
        message: "Review created successfully",
        review: newReview
    })
}

/**
 * @name editReview
 * @description Edit a existing review, require authentication and authorization, and expects updated review object in req.body and listing & review id in req.params
 * @access Public
 */
const editReview = async (req, res) => {
    const review = req.body;
    const { id: listingId } = req.params;

    const listing = await ListingModel.findById(listingId);
    if (!listing) throw new ExpressError(404, "Review for listing is removed or invalid");

    const toUpdate = req.review;

    toUpdate.comment = review.comment;
    toUpdate.rating = review.rating;

    await toUpdate.save();
    await toUpdate.populate("author", "username");

    res.status(200).json({
        success: true,
        message: "Review updated successfully",
        review: toUpdate
    });
}

/**
 * @name destroyReview
 * @description Deletes review, require authentication and authorization, and expects listing & review id in req.params
 * @access Public
 */
const destroyReview = async (req, res) => {
    const { id: listingId, reviewId } = req.params;

    const listing = await ListingModel.findOne({ _id: listingId, reviews: reviewId });
    if (!listing) throw new ExpressError(404, "Review for listing is removed or not belong this listing");
    await ListingModel.updateOne(
        { _id: listingId, reviews: reviewId },
        { $pull: { reviews: reviewId }}
    );

    await ReviewModel.findByIdAndDelete(req.review._id);

    res.status(200).json({
        success: true,
        message: "Review deleted successfully",
        reviewId,
    })
}

const reviewControllers = {
    createReview,
    editReview,
    destroyReview,
}

export default reviewControllers;