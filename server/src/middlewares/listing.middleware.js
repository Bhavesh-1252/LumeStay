import listingValidatorsSchema from "../validators/listing.validator.js";

export const validateGetListing = (req, res, next) => {
  const { error } = listingValidatorsSchema.getListingSchema.validate(
    req.params,
    { abortEarly: false },
  );

  if (error) {
    const fields = {};
    error.details.map((d) => {
      const key = d.path[0];
      if (key && !fields[key]) fields[key] = d.message;
    });

    return res.status(422).json({
      success: false,
      message: error.details[0].message,
      fields,
    });
  }
  next();
};
