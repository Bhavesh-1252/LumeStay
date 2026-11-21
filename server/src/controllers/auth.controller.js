import config from "../config/config.js";
import UserModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import OtpModel from "../models/otp.model.js";
import SessionModel from "../models/session.model.js";
import {
  sendPasswordResetEmail,
  sendUserVerificationEmail,
} from "../services/email.js";
import ExpressError from "../services/expressError.js";

/**
 * @name registerUserController
 * @description register a new user, expects username, email and password in the req.body
 * @access Public
 */
const registerUserController = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) throw new ExpressError(400, "All fields are required");

  const isUserExists = await UserModel.findOne({
    $or: [{ username }, { email }],
  });

  if (isUserExists) {
    throw new ExpressError(400, "Account already exists with this email or username");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await UserModel.create({
    username,
    email,
    password: hashedPassword,
  });

  const otp = crypto.randomInt(100000, 1000000).toString();
  const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
  await OtpModel.create({
    userId: user._id,
    email: user.email,
    otpHash,
    purpose: "email-verification",
  });

  const err = await sendUserVerificationEmail(email, otp);

  if (err) throw new ExpressError(500, err);

  return res.status(201).json({
    success: true,
    message: "Check your email to verify your account",
    user: {
      username: user.username,
      email: user.email,
      verified: user.verified,
    },
  });

};

/**
 * @name verifyUserController
 * @description Verify registered user through email, require OTP send through email
 * @access Public
 */
const verifyUserController = async (req, res) => {
  const { otp, email } = req.body;

  const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

  const otpDoc = await OtpModel.findOne({
    otpHash,
    email,
    purpose: "email-verification",
  });

  if (!otpDoc) throw new ExpressError(400, "Invalid OTP");

  const user = await UserModel.findByIdAndUpdate(
    otpDoc.userId,
    { verified: true },
    { returnDocument: "after" },
  );

  await OtpModel.deleteMany({
    userId: otpDoc.userId,
    purpose: "email-verification",
  });

  return res.status(200).json({
    success: true,
    message: "User verified successfully",
    user: {
      username: user.username,
      email: user.email,
      verified: user.verified,
    },
  });
}

/**
 * @name resendVerificationOtp
 * @description resend otp for account verification after registeration, require email 
 * @access Public
 */
const resendVerificationOtp = async (req, res) => {

  const { email } = req.body;

  const user = await UserModel.findOne({ email });
  if (!user || user.verified) {
    // same response for both unknown and registered emails, to avoid showing user existence
    return res.status(200).json({
      success: true,
      message: "If the account needs verification, a new code has been sent.",
    });
  }

  const otpDoc = await OtpModel.findOne({
    userId: user._id,
    purpose: "email-verification",
  });

  if (otpDoc && otpDoc.createdAt.getTime() + 60000 > Date.now()) {
    // if OTP is generate before 1 minute don't generate a another.
    return res.status(200).json({
      success: true,
      message: "Please wait a minute before requesting a new code.",
    });
  }

  if (otpDoc)
    await OtpModel.deleteOne({ _id: otpDoc._id });

  const otp = crypto.randomInt(100000, 1000000).toString();
  const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");
  await OtpModel.create({
    userId: user._id,
    otpHash: hashedOtp,
    email: user.email,
    purpose: "email-verification",
  });

  const error = await sendUserVerificationEmail(user.email, otp);
  if (error) {
    return res.status(200).json({
      success: true,
      message: "If the account needs verification, a new code has been sent.",
    });
  }

  res.status(200).json({
    success: true,
    message: "If the account needs verification, a new code has been sent.",
  });
}

/**
 * @name loginUserController
 * @description Login verified registered user through email or username, expects username or email and password
 * @access Public
 */
const loginUserController = async (req, res) => {
  // try {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    /* this error is handled internally by express -
     express call next(err) with this error and 
     next(err) goes to the middleware in our app.js
     file at the very bottom */
    throw new ExpressError(400, "All fields are required");
  }

  const user = await UserModel.findOne({
    $or: [{ username: identifier }, { email: identifier }],
  });

  if (!user) throw new ExpressError(401, "Invalid login credentials");

  if (!user.verified) throw new ExpressError(401, "Email is not verified");

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) throw new ExpressError(400, "Invalid login credentials");

  const refreshToken = jwt.sign(
    { id: user._id, username: user.username },
    config.JWT_SECRET,
    { expiresIn: "7d" },
  );

  const hashedRefreshToken = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  await SessionModel.create({
    userId: user._id,
    refreshToken: hashedRefreshToken,
    ip: req.ip,
    userAgent: req.headers["user-agent"],
  });

  const accessToken = jwt.sign(
    { id: user._id, username: user.username },
    config.JWT_SECRET,
    { expiresIn: "15m" },
  );

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return res.status(201).json({
    success: true,
    message: "User logged in successfully",
    user: {
      username: user.username,
      email: user.email,
    },
    accessToken,
  });
};

/**
 * @name logoutUserController
 * @description Logout user from the current session, expects refreshToken from cookies
 * @access Public
 */
const logoutUserController = async (req, res) => {
  const { refreshToken } = req.cookies ?? {};

  if (!refreshToken) throw new ExpressError(404, "Refresh token not found");

  const hashedRefreshToken = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");
  const session = await SessionModel.findOne({
    refreshToken: hashedRefreshToken,
    revoked: false,
  });

  if (!session) throw new ExpressError(400, "Invalid refresh token");

  session.revoked = true;
  session.revokedAt = new Date();
  await session.save();

  res.clearCookie("refreshToken");

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
}

/**
 * @name logoutAllUserController
 * @description Logout user from all the sessions, expects refreshToken from cookies
 * @access Public
 */
const logoutAllUserController = async (req, res) => {

  const { refreshToken } = req.cookies ?? {};

  if (!refreshToken) throw new ExpressError(404, "Refresh Token not found");

  const decoded = jwt.verify(refreshToken, config.JWT_SECRET);

  await SessionModel.updateMany(
    { userId: decoded.id, revoked: false },
    { revoked: true, revokedAt: new Date() },
  );

  res.clearCookie("refreshToken");

  res.status(200).json({
    success: true,
    message: "Logged out from all devices",
  });

};

/**
 * @name getMe
 * @description return user from req.user to client
 * @access Public
 */
const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    message: "User fetched successfully",
    user: req.user
  });
};

/**
 * @name rotateToken
 * @description Rotate accessToken and refreshToken automatically when accessToken is expired, expects refreshToken in cookies
 * @access Private
 */
const rotateToken = async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) throw new ExpressError(401, "Refresh Token not found!");

  const decoded = jwt.verify(refreshToken, config.JWT_SECRET);

  const hashedRefreshToken = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  const session = await SessionModel.findOne({
    refreshToken: hashedRefreshToken,
    revoked: false,
  });

  if (!session) throw new ExpressError(401, "Invalid refresh token!");

  const accessToken = jwt.sign(
    { id: decoded.id, username: decoded.username },
    config.JWT_SECRET,
    { expiresIn: "15m" },
  );

  const newRefreshToken = jwt.sign(
    { id: decoded.id, username: decoded.username },
    config.JWT_SECRET,
    { expiresIn: "7d" },
  );

  const hashedNewRefreshToken = crypto
    .createHash("sha256")
    .update(newRefreshToken)
    .digest("hex");
  session.refreshToken = hashedNewRefreshToken;
  await session.save();

  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    success: true,
    message: "Access token refreshed successfully",
    accessToken,
  });

};

/**
 * @name forgotPassword
 * @description Forget password - sends an OTP to the user, expects email in the body.
 * @access Public
 */
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await UserModel.findOne({ email });
  if (!user) {
    // same response for both unknown and registered emails, to avoid showing user existence
    return res.status(200).json({
      success: true,
      message: "If this email is registered, an OTP has been sent.",
    });
  }

  const otpDoc = await OtpModel.findOne({
    userId: user._id,
    purpose: "password-reset",
  });

  if (otpDoc && otpDoc.createdAt.getTime() + 60000 > Date.now()) {
    // if OTP is generate before 1 minute don't generate a another.
    return res.status(200).json({
      success: true,
      message: "If this email is registered, an OTP has been sent.",
    });
  }

  if (otpDoc)
    await OtpModel.deleteOne({ _id: otpDoc._id, purpose: "password-reset" });

  const otp = crypto.randomInt(100000, 1000000).toString();
  const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");
  await OtpModel.create({
    userId: user._id,
    otpHash: hashedOtp,
    email: user.email,
    purpose: "password-reset",
  });

  const error = await sendPasswordResetEmail(user.email, otp);
  if (error) {
    return res.status(200).json({
      success: true,
      message: "If this email is registered, an OTP has been sent. email",
    });
  }

  res.status(200).json({
    success: true,
    message: "If this email is registered, an OTP has been sent.",
  });

};

/**
 * @name verifyOtp
 * @description Utility function for verifyResetOtp and resetPassword controller,
 * @access Private
 */
const verifyOtp = async (userId, otp) => {
  const MAX_ATTEMPTS = 7;
  const otpDoc = await OtpModel.findOne({
    userId,
    purpose: "password-reset",
  });

  if (!otpDoc) return { ok: false, reason: "OTP_EXPIRED" };

  if (otpDoc.createdAt.getTime() + 600000 < Date.now()) {
    // 10 minutes expiry time
    await OtpModel.deleteOne({ _id: otpDoc._id });
    return { ok: false, reason: "OTP_EXPIRED" };
  }

  const updatedOtpDoc = await OtpModel.findOneAndUpdate(
    { _id: otpDoc._id, attempts: { $lt: MAX_ATTEMPTS } },
    { $inc: { attempts: 1 } },
    { returnDocument: 'after' },
  );

  if (!updatedOtpDoc) {
    await OtpModel.deleteOne({ _id: otpDoc._id });
    return { ok: false, reason: "OTP_ATTEMPTS_EXCEEDED" };
  }

  const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");
  if (hashedOtp !== updatedOtpDoc.otpHash) {
    if (updatedOtpDoc.attempts >= MAX_ATTEMPTS) {
      await OtpModel.deleteOne({ _id: updatedOtpDoc._id });
      return { ok: false, reason: "OTP_ATTEMPTS_EXCEEDED" };
    }
    return {
      ok: false,
      reason: "OTP_INVALID",
      attemptsLeft: MAX_ATTEMPTS - updatedOtpDoc.attempts,
    };
  }

  return { ok: true };
};

/**
 * @name verifyResetOtp
 * @description Verify OTP for password reset - expects email and OTP in the body
 * @access Public
 */
const verifyResetOtp = async (req, res) => {

  const { email, otp } = req.body;

  const user = await UserModel.findOne({ email });
  if (!user) throw new ExpressError(400, "Code expired. Please request a new one.");

  const result = await verifyOtp(user._id, otp);

  if (!result.ok) {
    const messages = {
      OTP_EXPIRED: "Code expired. Please request a new one.",
      OTP_INVALID: "Invalid code.",
      OTP_ATTEMPTS_EXCEEDED: "Too many attempts. Please request a new code.",
    };

    const status = result.reason === "OTP_ATTEMPTS_EXCEEDED" ? 429 : 400;
    throw new ExpressError(status, messages[result.reason]);
  }

  return res.status(200).json({
    success: true,
    message: "OTP verified successfully!",
  });

};

/**
 * @name resetPassword
 * @description reset password and remove all the sessions for the user, expects email, otp and newPassword
 * @access Public
 */
const resetPassword = async (req, res) => {

  const { email, otp, password } = req.body;

  const user = await UserModel.findOne({ email });
  if (!user) throw new ExpressError(400, "Code expired. Please request a new one.");

  const result = await verifyOtp(user._id, otp);
  if (!result.ok) {
    const messages = {
      OTP_EXPIRED: "Code expired. Please request a new one.",
      OTP_INVALID: "Invalid code.",
      OTP_ATTEMPTS_EXCEEDED: "Too many attempts. Please request a new code.",
    };

    const status = result.reason === "OTP_ATTEMPTS_EXCEEDED" ? 429 : 400;
    throw new ExpressError(status, messages[result.reason]);
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  user.password = hashedPassword;
  user.verified = true;
  await user.save();

  await OtpModel.deleteMany({
    userId: user._id,
    purpose: { $in: ["password-reset", "email-verification"] },
  });
  await SessionModel.deleteMany({ userId: user._id });

  res.status(200).json({
    success: true,
    message: "Password reset successfully!",
  });
};

export default {
  registerUserController,
  verifyUserController,
  resendVerificationOtp,
  loginUserController,
  logoutUserController,
  logoutAllUserController,
  getMe,
  rotateToken,
  forgotPassword,
  verifyResetOtp,
  resetPassword,
};
