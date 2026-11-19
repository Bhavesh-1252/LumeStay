import express from "express"
import { requireAuth, validate } from "../middlewares/auth.middleware.js";
import listingValidatorsSchema from "../validators/listing.validator.js";
import reviewControllers from "../controllers/reviews.controller.js";
import { authorizeReviewOwner } from "../middlewares/listing.middleware.js";

const reviewRouter = express.Router({ mergeParams: true });
// Reviews Routes 

reviewRouter.post("/",
    requireAuth,
    validate(listingValidatorsSchema.idSchema, "params"),
    validate(listingValidatorsSchema.reviewSchema),
    reviewControllers.createReview);

reviewRouter.put("/:reviewId",
    requireAuth,
    validate(listingValidatorsSchema.reviewParamsSchema, "params"),
    authorizeReviewOwner,
    validate(listingValidatorsSchema.reviewSchema),
    reviewControllers.editReview);


reviewRouter.delete("/:reviewId",
    requireAuth,
    validate(listingValidatorsSchema.reviewParamsSchema, "params"),
    authorizeReviewOwner,
    reviewControllers.destroyReview);

export default reviewRouter;