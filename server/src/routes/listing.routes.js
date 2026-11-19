import express from "express";
import multer from "multer"
import { requireAuth, validate } from "../middlewares/auth.middleware.js";
import listingValidatorsSchema from "../validators/listing.validator.js";
import listingControllers from "../controllers/listings.controller.js";
import { storage } from "../services/cloudConfig.js"
import { authorizeListingOwner } from "../middlewares/listing.middleware.js";

const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error("Only JPEG, PNG and WEBP images are allowed"));
    }
}

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 1.5 * 1024 * 1024,
    }
})

const listingRouter = express.Router();

listingRouter.get("/", listingControllers.getAllListings);

listingRouter.post("/",
    requireAuth,
    upload.single("image"),
    validate(listingValidatorsSchema.listingSchema),
    listingControllers.createListing);

listingRouter.get("/:id",
    validate(listingValidatorsSchema.idSchema, "params"),
    listingControllers.getListing,
)

listingRouter.put("/:id",
    requireAuth,
    validate(listingValidatorsSchema.idSchema, "params"),
    upload.single("image"),
    authorizeListingOwner,
    validate(listingValidatorsSchema.listingSchema),
    listingControllers.updateListing,
)

listingRouter.delete("/:id",
    requireAuth,
    validate(listingValidatorsSchema.idSchema, "params"),
    authorizeListingOwner,
    listingControllers.destroyListing,
)

export default listingRouter;