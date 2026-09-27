import express from "express"
import { isLoggedIn, isReviewAuthor, validateReview } from "../middleware.js";
import { createReview, destroyReview } from "../controllers/reviews.js";
import { wrapAsync } from "../utils/wrapAsync.js";

const router = express.Router({ mergeParams: true });
// Reviews Routes 

// Create Review
router.post("/",
    isLoggedIn,
    validateReview,
    wrapAsync(createReview))

// Delete
router.delete("/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(destroyReview))

export default router;