const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const { validateReview, isLoggedIn } = require("../middleware.js");
const router = express.Router({ mergeParams: true });
const { isReviewAuthor } = require("../middleware");
const { createReview, destroyReview } = require("../controllers/reviews.js");

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

module.exports = router;