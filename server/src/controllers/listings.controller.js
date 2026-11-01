import mongoose from "mongoose";
import { geocoding } from "@maptiler/client";
import { filters } from "../utils/mock.js";
import ListingModel from "../models/listing.model.js";

const mapToken = process.env.MAP_TOKEN;

const getListing = async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await ListingModel.findById(id).populate({
        path: "reviews",
        populate: {
            path: "author",
        },
    });

    if(!listing) {
        return res.status(404).json({
            success: false,
            message: "Listing not found!"
        });
    }

    res.status(200).json({
        success: true,
        message: "Listing fetched successfully"
    })
  } catch (error) {
    res.status(500).json({
        success: false,
        message: error.message
    })
  }
};

const createListing = async (req, res) => {
  const { path, filename } = req.file;
  const listing = req.body.listing;
  const response = await geocoding.forward(
    `${listing.location} ${listing.country}`,
    { limit: 1, apiKey: mapToken },
  );
  const newListing = new Listing(listing);
  newListing.image = { url: path, filename };
  newListing.owner = req.user._id;
  newListing.geometry = response.features[0].geometry;
  let updatedListing = await newListing.save();

  req.flash("success", "New Listing Created!"); // Generating a Flash message
  res.redirect("/listings");
};

const editListing = async (req, res) => {
  const { id } = req.params;
  const list = await Listing.findById(id);

  if (!list) {
    req.flash("error", "Requested Listing Doesn't Exists!");
    return res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { list });
};

const updateListing = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.file !== "undefined") {
    listing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
    await listing.save();
  }

  req.flash("success", "Listing Updated!"); // Generating a Flash message
  res.redirect(`/listings/${id}`);
};

const destroyListing = async (req, res) => {
  const { id } = req.params;

  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Delete!"); // Generating a Flash message
  res.redirect(`/listings`);
};
const listingControllers = {
  getListing,
  createListing,
  updateListing,
  destroyListing,
};

export default listingControllers;
