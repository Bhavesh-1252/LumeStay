import config from "../config/config.js";
import UserModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import OtpModel from "../models/otp.model.js";
import SessionModel from "../models/session.model.js";
import {
  sendPasswordResetEmail,
  sendRegistrationEmail,
} from "../services/email.js";

/**
 * @name registerUserController
 * @description register a new user, expects username, email and password in the req.body
 * @access Public
 */
const registerUserController = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const isUserExists = await UserModel.findOne({
      $or: [{ username }, { email }],
    });

    if (isUserExists) {
      return res.status(400).json({
        success: false,
        message: "Account already exists with this email or username!",
      });
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

    const err = await sendRegistrationEmail(email, otp);

    if (err) {
      return res.status(500).json({
        success: false,
        message: err,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Check your email to verify your account",
      user: {
        username: user.username,
        email: user.email,
        verified: user.verified,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @name verifyUserController
 * @description Verify registered user through email, require OTP send through email
 * @access Public
 */
const verifyUserController = async (req, res) => {
  try {
    const { otp, email } = req.body;

    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

    const otpDoc = await OtpModel.findOne({
      otpHash,
      email,
      purpose: "email-verification",
    });

    if (!otpDoc) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    const user = await UserModel.findByIdAndUpdate(
      otpDoc.userId,
      { verified: true },
      { new: true },
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
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @name loginUserController
 * @description Login verified registered user through email or username, expects username or email and password
 * @access Public
 */
const loginUserController = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await UserModel.findOne({
      $or: [{ username: identifier }, { email: identifier }],
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid login credentials",
      });
    }

    if (!user.verified) {
      return res.status(401).json({
        success: false,
        message: "Email is not verified",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid login credentials",
      });
    }

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
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @name logoutUserController
 * @description Logout user from the current session, expects refreshToken from cookies
 * @access Public
 */
const logoutUserController = async (req, res) => {
  try {
    const { refreshToken } = req.cookies ?? {};

    if (!refreshToken) {
      return res.status(404).json({
        success: false,
        message: "Refresh token not found",
      });
    }

    const hashedRefreshToken = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");
    const session = await SessionModel.findOne({
      refreshToken: hashedRefreshToken,
      revoked: false,
    });

    if (!session) {
      return res.status(400).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    session.revoked = true;
    session.revokedAt = new Date();
    await session.save();

    res.clearCookie("refreshToken");

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @name logoutAllUserController
 * @description Logout user from all the sessions, expects refreshToken from cookies
 * @access Public
 */
const logoutAllUserController = async (req, res) => {
  try {
    const { refreshToken } = req.cookies ?? {};

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh Token not found",
      });
    }

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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @name getMe
 * @description Get user from the database, expects accessToken in Authorization headers
 * @access Public
 */
const getMe = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token not provided!",
      });
    }

    const decoded = jwt.verify(token, config.JWT_SECRET);

    const user = await UserModel.findById(decoded.id);

    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      user: {
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: error.message || "Invalid access Token",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

/**
 * @name rotateToken
 * @description Rotate accessToken and refreshToken automatically when accessToken is expired, expects refreshToken in cookies
 * @access Private
 */
const rotateToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh Token not found!",
      });
    }

    const decoded = jwt.verify(refreshToken, config.JWT_SECRET);

    const hashedRefreshToken = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    const session = await SessionModel.findOne({
      refreshToken: hashedRefreshToken,
      revoked: false,
    });

    if (!session) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token!",
      });
    }

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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @name forgotPassword
 * @description Forget password - sends an OTP to the user, expects email in the body.
 * @access Public
 */
const forgotPassword = async (req, res) => {
  try {
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
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong, please try again later!",
    });
  }
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
    { returnDocument: "after" },
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
  try {
    const { email, otp } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Code expired. Please request a new one.",
      });
    }

    const result = await verifyOtp(user._id, otp);

    if (!result.ok) {
      const messages = {
        OTP_EXPIRED: "Code expired. Please request a new one.",
        OTP_INVALID: "Invalid code.",
        OTP_ATTEMPTS_EXCEEDED: "Too many attempts. Please request a new code.",
      };

      const status = result.reason === "OTP_ATTEMPTS_EXCEEDED" ? 429 : 400;
      return res.status(status).json({
        success: false,
        message: messages[result.reason],
        attemptsLeft: result.attemptsLeft,
      });
    }

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully!",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong, Please again later!",
    });
  }
};

/**
 * @name resetPassword
 * @description reset password and remove all the sessions for the user, expects email, otp and newPassword
 * @access Public
 */
const resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Code expired. Please request a new one.",
      });
    }

    const result = await verifyOtp(user._id, otp);
    if (!result.ok) {
      const messages = {
        OTP_EXPIRED: "Code expired. Please request a new one.",
        OTP_INVALID: "Invalid code.",
        OTP_ATTEMPTS_EXCEEDED: "Too many attempts. Please request a new code.",
      };

      const status = result.reason === "OTP_ATTEMPTS_EXCEEDED" ? 429 : 400;
      return res.status(status).json({
        success: false,
        message: messages[result.reason],
        attemptsLeft: result.attemptsLeft,
      });
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
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong, please try again later!",
    });
  }
};

export default {
  registerUserController,
  verifyUserController,
  loginUserController,
  logoutUserController,
  logoutAllUserController,
  getMe,
  rotateToken,
  forgotPassword,
  verifyResetOtp,
  resetPassword,
};
