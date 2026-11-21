import ListingModel from "../models/listing.model.js";
import ReviewModel from "../models/review.model.js";
import ExpressError from "../services/expressError.js";

export const authorizeListingOwner = async (req, res, next) => {
    const {id} = req.params;

    const listing = await ListingModel.findById(id);

    if(!listing) throw new ExpressError(404, "Listing is deleted or invalid");
    
    if(listing.owner.toString() !== req.user.id.toString()) throw new ExpressError(403, "User is not authorized");

    req.listing = listing;
    next();
}

export const authorizeReviewOwner = async (req, res, next) => {
    const {reviewId} = req.params;

    const review = await ReviewModel.findById(reviewId);

    if(!review) throw new ExpressError(404, "Review is deleted or invalid");
    
    if(review.author.toString() !== req.user.id.toString()) throw new ExpressError(403, "User have not permitted or authorized");

    req.review = review;
    next();
}