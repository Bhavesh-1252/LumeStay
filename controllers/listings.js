const { default: mongoose } = require("mongoose");
const Listing = require("../models/listingSchema");
const { geocoding } = require('@maptiler/client')
const {filters} = require("../utils/mock.js")

const mapToken = process.env.MAP_TOKEN;

const indexListing = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings, filters });
}

const newListing = (req, res) => {
    res.render('listings/new.ejs');
}

const showListing = async (req, res) => {
    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)) {
        req.flash("error", "Invalid Listing Id!");
        return res.redirect("/listings")
    }

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
    res.render("listings/show.ejs", { list, mapToken: mapToken });
}

const createListing = async (req, res) => {
    const { path, filename } = req.file;
    const listing = req.body.listing;
    const response = await geocoding.forward(
        `${listing.location} ${listing.country}`,
        { limit: 1, apiKey: mapToken }
    )
    const newListing = new Listing(listing);
    newListing.image = { url: path, filename };
    newListing.owner = req.user._id;
    newListing.geometry = response.features[0].geometry;
    let updatedListing = await newListing.save();

    console.log(updatedListing);

    req.flash("success", "New Listing Created!") // Generating a Flash message
    res.redirect("/listings");
}

const editListing = async (req, res) => {
    const { id } = req.params;
    const list = await Listing.findById(id);

    if (!list) {
        req.flash("error", "Requested Listing Doesn't Exists!")
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { list });
}

const updateListing = async (req, res) => {
    const { id } = req.params;

    const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing })
    if (typeof req.file !== "undefined") {
        listing.image = {
            url: req.file.path,
            filename: req.file.filename,
        };
        await listing.save();
    }

    req.flash("success", "Listing Updated!") // Generating a Flash message
    res.redirect(`/listings/${id}`);
}

const destroyListing = async (req, res) => {
    const { id } = req.params;

    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Delete!") // Generating a Flash message
    res.redirect(`/listings`);
}

module.exports = {
    indexListing,
    newListing,
    showListing,
    createListing,
    editListing,
    updateListing,
    destroyListing
};