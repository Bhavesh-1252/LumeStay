import Joi from "joi";
import mongoose from "mongoose";

const objectIdValidation = (value, helper) => {
  if (!mongoose.isValidObjectId(value)) {
    return helper.message("Invalid listing Id");
  }
  return value;
};

export const getListingSchema = Joi.object({
    id: Joi.string().custom(objectIdValidation).required(),
});

export const listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    price: Joi.number().required().min(0),
    image: Joi.string().allow("", null),
    country: Joi.string().required(),
  }).required(),
});

export const reviewSchema = Joi.object({
  review: Joi.object({
    comment: Joi.string().required(),
    rating: Joi.number().required().min(1).max(5),
  }).required(),
});

const listingValidatorsSchema = {
    getListingSchema,
    listingSchema,
    reviewSchema
}

export default listingValidatorsSchema;