import Joi from "joi";
import mongoose from "mongoose";

const objectIdValidation = (value, helper) => {
  if (!mongoose.isValidObjectId(value)) {
    console.log(value);
    return helper.message("Not a valid source");
  }
  return value;
};

const errorMessages = {
  "string.empty": "{#label} is required",
  "string.min": "{#label} must be at least {#limit} characters",
  "string.max": "{#label} must be at most {#limit} characters",
  "number.min": "{#label} must be at least {#limit} characters",
  "any.required": "{#label} is required",
}

const idSchema = Joi.object({
  id: Joi.string().custom(objectIdValidation).required(),
});

const listingSchema = Joi.object({
  title: Joi.string().trim().min(5).max(80).required().messages(errorMessages),
  description: Joi.string().trim().min(5).max(600).required().messages(errorMessages),
  price: Joi.number().min(0).required().messages(errorMessages),
  location: Joi.string().trim().min(3).max(50).required().messages(errorMessages),
  country: Joi.string().trim().min(3).max(50).required().messages(errorMessages),
});

const reviewSchema = Joi.object({
  comment: Joi.string().trim().min(1).max(200).required().messages(errorMessages),
  rating: Joi.number().integer().min(1).max(5).required().messages(errorMessages),
});

const reviewParamsSchema = Joi.object({
  id: Joi.string().custom(objectIdValidation).required(),
  reviewId: Joi.string().custom(objectIdValidation).required(),
})

const updateListingSchema = Joi.object({
  listing: listingSchema,
  id: idSchema,
})

const listingValidatorsSchema = {
  idSchema,
  listingSchema,
  updateListingSchema,
  reviewSchema,
  reviewParamsSchema,
}

export default listingValidatorsSchema;