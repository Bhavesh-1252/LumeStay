import config from "../config/config.js";
import ListingModel from "../models/listing.model.js";
import { geocoding } from '@maptiler/client';
import ExpressError from "../services/expressError.js";
import { cloudinary } from "../services/cloudConfig.js";

/**
 * @name getAllListings
 * @description fetch all listings from the database
 * @access Public
 */
const getAllListings = async (req, res) => {
  const listings = await ListingModel.find({}, null, { sort: { createdAt: -1 } }).select("title price image");
  if (listings.length === 0) {
    return res.status(200).json({
      success: true,
      message: "No listings available"
    });
  }

  return res.status(200).json({
    success: true,
    message: "All listings fetched",
    listings
  })
}

/**
 * @name createListing
 * @description Create a new listing, require authentication, and expects listing object in req.body
 * @access Public
 */
const createListing = async (req, res) => {
  const listing = req.body;
  const { path, filename } = req.file ?? {};

  listing.owner = req.user.id;
  const place = listing.location + "," + listing.country;
  const result = await geocoding.forward(place, {
    apiKey: config.MAP_TOKEN,
    fuzzyMatch: false,
    limit: 1
  });

  if (result.features.length === 0) throw new ExpressError(404, "Location not found");
  listing.geometry = result.features[0].geometry; // geometry have type & coordinates [lng, lat]

  if (path && filename) listing.image = { path, filename };

  const newListing = await ListingModel.create(listing);

  res.status(201).json({
    success: true,
    message: "Listing created successfully",
    listingId: newListing._id,
  });
};

/**
 * @name getListing
 * @description Retrieve a listing, expects listing id in req.params
 * @access Public
 */
const getListing = async (req, res) => {
  const { id } = req.params;

  const listing = await ListingModel.findById(id).populate("owner", "username").populate({
    path: "reviews",
    populate: { path: "author", select: "username" },
    options : {
      sort: {createdAt: -1}
    }    
  });
if (!listing) {
  throw new ExpressError(404, "Listing not found");
}

res.status(200).json({
  success: true,
  message: "Listing fetched successfully",
  listing
})
}

/**
 * @name updateListing
 * @description Update a existing listing, require authentication, and expects listing object in req.body
 * @access Public
 */
const updateListing = async (req, res) => {
  const listing = req.body;
  const { path, filename } = req.file ?? {};

  const toUpdate = req.listing;

  if (toUpdate.location !== listing.location || toUpdate.country !== listing.country) {

    const place = listing.location + "," + listing.country;
    const result = await geocoding.forward(place, {
      apiKey: config.MAP_TOKEN,
      fuzzyMatch: false,
      limit: 1
    });

    if (result.features.length === 0) throw new ExpressError(404, "Location not found");

    toUpdate.geometry = result.features[0].geometry; // geometry have type & coordinates
    toUpdate.location = listing.location;
    toUpdate.country = listing.country;
  }

  if (path && filename) {
    if (toUpdate?.image?.filename)
      await cloudinary.uploader.destroy(toUpdate.image.filename);
    toUpdate.image = { path, filename };
  };

  toUpdate.title = listing.title;
  toUpdate.description = listing.description;
  toUpdate.price = listing.price;

  await toUpdate.save();

  res.status(200).json({
    success: true,
    message: "Listing updated successfully",
    listingId: toUpdate._id,
  });
}

/**
 * @name destroyListing
 * @description Deletes a existing listing, require authentication, and expects listing id in req.params
 * @access Public
 */
const destroyListing = async (req, res) => {
  await ListingModel.findOneAndDelete({ _id: req.listing._id });

  return res.status(200).json({
    success: true,
    message: "Listing deleted successfully"
  });
}

const listingControllers = {
  getAllListings,
  createListing,
  getListing,
  updateListing,
  destroyListing
};

export default listingControllers;
