import authValidators from "../validators/auth.validator.js";
import rateLimit from "express-rate-limit"


const createLimiter = ({ minutes, limit, message }) => rateLimit({
  windowMs: minutes * 60 * 1000,
  limit,
  legacyHeaders: false,
  standardHeaders: true,
  handler: (req, res) => res.status(429).json({
    success: false,
    code: "RATE_LIMITED",
    message
  })
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


export const validateRegisteration = (req, res, next) => {
  const { error, value } = authValidators.registerSchema.validate(req.body, {
    abortEarly: false,
  });

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

  req.body = value;
  next();
};

export const validateVerification = (req, res, next) => {
  const { error, value } = authValidators.verificationSchema.validate(
    req.body,
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

  req.body = value;
  next();
};

export const validateLogin = (req, res, next) => {
  const { error, value } = authValidators.loginSchema.validate(req.body, {
    abortEarly: false,
  });

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

  req.body = value;
  next();
};

export const validateForgotPassword = (req, res, next) => {
  const { error, value } = authValidators.forgotPasswordSchema.validate(
    req.body,
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
  req.body = value;
  next();
};

export const validateVerifyResetOtp = (req, res, next) => {
  const { error, value } = authValidators.verifyOtpSchema.validate(req.body, {
    abortEarly: false,
  });

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

  req.body = value;
  next();
};

export const validateResetPassword = (req, res, next) => {
  const { error, value } = authValidators.resetPasswordSchema.validate(
    req.body,
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

  req.body = value;
  next();
};
