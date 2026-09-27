import express from "express"
import multer from "multer";
import { storage } from "../services/cloudConfig.js";
import { wrapAsync } from "../utils/wrapAsync.js";
import { isLoggedIn, isOwner, validateListing } from "../middleware.js";
import {
    indexListing, newListing,
    createListing, showListing,
    editListing, updateListing,
    destroyListing
} from "../controllers/listings.js";

const router = express.Router();
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

export default router;