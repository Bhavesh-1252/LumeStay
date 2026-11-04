import express from "express";
import multer from "multer"
import { requireAuth, validate } from "../middlewares/auth.middleware.js";
import listingValidatorsSchema from "../validators/listing.validator.js";
import listingControllers from "../controllers/listings.controller.js";

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
    dest: "/uploads",
    fileFilter,
    limits: {
        fileSize: 1024 * 1024,
    }
})

const listingRouter = express.Router();

listingRouter.post("/",
    requireAuth,
    upload.single("image"),
    validate(listingValidatorsSchema.listingSchema),
    listingControllers.createListing);

export default listingRouter;