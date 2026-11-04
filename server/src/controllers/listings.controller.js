import ListingModel from "../models/listing.model.js";
import { geocoding } from "@maptiler/client";

const createListing = async (req, res) => {

  const listing = req.body;
  const { path, filename } = req.file;

  // listing.owner = req.user.id;
  // listing.
  
  // const newListing = await ListingModel.create(listing);
  // newListing.owner = req.user.id;
  // await newListing.save();

  const result = geocoding.forward(listing.location + ',' + listing.country);
  console.log(result);

  res.status(201).json({
    success: true,
    message: "Listing created successfully",
    listing: newListing
  })
}

const listingControllers = {
  createListing,
}

export default listingControllers;