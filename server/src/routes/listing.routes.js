import express from "express"
import multer from "multer";
import { storage } from "../services/cloudConfig.js";
import { wrapAsync } from "../utils/wrapAsync.js";
import { isLoggedIn, isOwner, validateListing } from "../middlewares/middleware.js";
import listingControllers from "../controllers/listings.controller.js";
import listingValidatorsSchema from "../validators/listing.validator.js";
import { validate } from "../middlewares/auth.middleware.js";
import { validateGetListing } from "../middlewares/listing.middleware.js";

const listingRouter = express.Router();
const upload = multer({ storage }); // Cloudinary Destination to store file 

// listingRouter.route('/')
//     .get(wrapAsync(indexListing)) // index
//     .post(isLoggedIn, // create
//         upload.single("listing[image]"),
//         validateListing,
//         wrapAsync(createListing))

listingRouter.get("/:id", validateGetListing, listingControllers.getListing);



// listingRouter.route("/:id")
//     .get(wrapAsync(showListing)) // Show
//     .put(isLoggedIn, // Update
//         isOwner,
//         upload.single("listing[image]"),
//         validateListing,
//         wrapAsync(updateListing))
//     .delete(isLoggedIn, // Destroy
//         isOwner,
//         wrapAsync(destroyListing))


// Edit listing form
// listingRouter.get("/:id/edit",
//     isLoggedIn,
//     isOwner,
//     wrapAsync(editListing))

export default listingRouter;