const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, isOwner, validateListing } = require("../middleware");
const { indexListing, newListing,
    createListing, showListing,
    editListing, updateListing,
    destroyListing } = require("../controllers/listings");
    const {storage} = require("../cloudConfig.js");
const multer = require("multer");
const upload = multer({ storage }); // Cloudinary Destination to store file 

router.route('/')
    .get(wrapAsync(indexListing)) // index
    .post(isLoggedIn, // create
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(createListing))

// New Listing form
router.get("/new", isLoggedIn, newListing)

router.route("/:id")
    .get(wrapAsync(showListing)) // Show
    .put(isLoggedIn, // Update
        isOwner,
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(updateListing))
    .delete(isLoggedIn, // Destroy
        isOwner,
        wrapAsync(destroyListing))


// Edit listing form
router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(editListing))

module.exports = router;