import rateLimit from "express-rate-limit";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import UserModel from "../models/user.model.js";
import ExpressError from "../services/expressError.js";

const createLimiter = ({ minutes, limit, message }) => rateLimit({
  windowMs: minutes * 60 * 1000,
  limit,
  legacyHeaders: false,
  standardHeaders: true,
  handler: (req, res, next) => next(new ExpressError(429, message))
})

export const forgotPasswordLimiter = createLimiter({
  minutes: 15,
  limit: 8,
  message: "Too many requests. Please try again in few minutes!"
})

export const otpCheckerLimiter = createLimiter({
  minutes: 15,
  limit: 10,
  message: "Too many attempts. Please try again later!"
})

export const validate = (schema, source = "body") => (req, res, next) => {
  const { error, value } = schema.validate(req[source], {
    abortEarly: false,
  });

  if (error) {
    const fields = {};
    error.details.forEach((d) => {
      const key = d.path[0];
      if (key && !fields[key]) fields[key] = d.message;
    });

    throw new ExpressError(422, error.details[0].message, fields);
  }

  req[source] = value;
  next();
}

/**
 * @name requireAuth
 * @description authenticate user through provided accessToken after successfully login and set the user in request object
 * @access Private
 */
export const requireAuth = async (req, res, next) => {

  const token = req.headers.authorization?.split(" ")[1];

  if (!token) throw new ExpressError(401, "User is not authorized");

  const decoded = jwt.verify(token, config.JWT_SECRET);

  const user = await UserModel.findById(decoded.id);

  if (!user) throw new ExpressError(401, "User no longer exists");

  req.user = {
    id: user._id,
    username: user.username,
    email: user.email
  };
  
  next();
}