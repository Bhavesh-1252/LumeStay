import Joi from "joi";
import mongoose from "mongoose";

const objectIdValidation = (value, helper) => {
  if (!mongoose.isValidObjectId(value)) {
    return helper.message("Invalid listing Id");
  }
  return value;
};

const getListingSchema = Joi.object({
  id: Joi.string().custom(objectIdValidation).required(),
});

const listingSchema = Joi.object({
  title: Joi.string().trim().required(),
  description: Joi.string().trim().required(),
  location: Joi.string().trim().required(),
  price: Joi.number().required().min(0),
  country: Joi.string().trim().required(),
});

const reviewSchema = Joi.object({
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