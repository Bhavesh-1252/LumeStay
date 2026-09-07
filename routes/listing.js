const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing");
const ExpressError = require("../utils/expressError");
const { listingSchema } = require("../schema");

const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);

    if (error) {
        const errorMsg = error.details.map(el => el.message).join(',');
        console.log(error);
        throw new ExpressError(400, errorMsg);
    }
    else {
        next();
    }
}

// Index Listings
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}))

// New Listing form
router.get("/new", (req, res) => {
    res.render('listings/new.ejs');
})

// Show Listing by Id
router.get("/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const list = await Listing.findById(id).populate("reviews");

    if(!list) {
        req.flash("error", "Requested Listing Doesn't Exists!")
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { list });
}))

//Create listing
router.post("/", validateListing, wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();

    req.flash("success", "New Listing Created!") // Generating a Flash message
    res.redirect("/listings");
}))

// Edit listing form
router.get("/:id/edit", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const list = await Listing.findById(id);

    if(!list) {
        req.flash("error", "Requested Listing Doesn't Exists!")
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { list });
}))

// Update Listing
router.put("/:id", validateListing, wrapAsync(async (req, res) => {
    const { id } = req.params;
    console.log(id);
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing Updated!") // Generating a Flash message
    res.redirect(`/listings/${id}`);
}))

// Delete Listing
router.delete("/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Delete!") // Generating a Flash message
    res.redirect(`/listings`);
}))


module.exports = router;