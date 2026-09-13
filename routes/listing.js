const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing");
const { isLoggedIn, isOwner, validateListing } = require("../middleware");

// Index Listings
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}))

// New Listing form
router.get("/new", isLoggedIn, (req, res) => {
    res.render('listings/new.ejs');
})

// Show Listing by Id
router.get("/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const list = await Listing.findById(id)
        .populate({
            path: "reviews", populate: {
                path: "author",
            }
        })
        .populate("owner");

    if (!list) {
        req.flash("error", "Requested Listing Doesn't Exists!")
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { list });
}))

//Create listing
router.post("/", isLoggedIn, validateListing, wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    console.log(req.user);
    newListing.owner = req.user._id;
    await newListing.save();

    req.flash("success", "New Listing Created!") // Generating a Flash message
    res.redirect("/listings");
}))

// Edit listing form
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const list = await Listing.findById(id);

    if (!list) {
        req.flash("error", "Requested Listing Doesn't Exists!")
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { list });
}))

// Update Listing
router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(async (req, res) => {
    const { id } = req.params;

    await Listing.findByIdAndUpdate(id, { ...req.body.listing })

    req.flash("success", "Listing Updated!") // Generating a Flash message
    res.redirect(`/listings/${id}`);
}))

// Delete Listing
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    const { id } = req.params;

    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Delete!") // Generating a Flash message
    res.redirect(`/listings`);
}))


module.exports = router;