import config from "../config/config.js";
import UserModel from "../models/user.model.js"
import verifyEmail from "../services/email.js";
import bcrypt from "bcrypt"
import crypto from "crypto"
import jwt from "jsonwebtoken"
import OtpModel from "../models/otp.model.js";
import SessionModel from "../models/session.model.js";


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
                message: "All fields are required",
            });
        }

        const isUserExists = await UserModel.findOne({
            $or: [
                { username },
                { email }
            ]
        })

        if (isUserExists) {
            return res.status(400).json({
                message: "Account already exists with this email or username!",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await UserModel.create({
            username,
            email,
            password: hashedPassword,
        })

        const otp = crypto.randomInt(100000, 1000000).toString();
        const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
        await OtpModel.create({
            userId: user._id,
            email: user.email,
            otpHash
        })

        const err = await verifyEmail(email, otp);

        if (err) {
            return res.status(500).json({
                message: err,
            })
        }

        return res.status(201).json({
            message: "User Registered successfully. Check your email to verify your account",
            user: {
                username: user.username,
                email: user.email,
                verified: user.verified,
            }
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

/**
 * @name verifyUserController
 * @description Verify registered user through email, require OTP send through email
 * @access Public 
 */
const verifyUserController = async (req, res) => {
    try {
        const { otp, email } = req.body;

        if (!otp) {
            return res.status(400).json({
                message: "OTP is required"
            })
        }

        const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

        const otpDoc = await OtpModel.findOne({
            otpHash, email
        })

        if (!otpDoc) {
            return res.status(400).json({
                message: "Invalid OTP"
            })
        }

        const user = await UserModel.findByIdAndUpdate(otpDoc.userId, { verified: true }, { new: true });

        await OtpModel.deleteMany({ userId: otpDoc.userId });

        return res.status(200).json({
            message: "User verified successfully",
            user: {
                username: user.username,
                email: user.email,
                verified: user.verified
            }
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}


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
                message: "All fields are required",
            })
        }

        const user = await UserModel.findOne({
            $or: [
                { username: identifier },
                { email: identifier }
            ]
        })

        if (!user) {
            return res.status(401).json({
                message: "Invalid login credentials"
            })
        }

        if (!user.verified) {
            return res.status(401).json({
                message: "Email is not verified"
            })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid login credentials"
            })
        }

        const refreshToken = jwt.sign(
            { id: user._id, username: user.username },
            config.JWT_SECRET,
            { expiresIn: "7d" }
        )

        const hashedRefreshToken = crypto.createHash("sha256").update(refreshToken).digest("hex");

        await SessionModel.create({
            userId: user._id,
            refreshToken: hashedRefreshToken,
            ip: req.ip,
            userAgent: req.headers["user-agent"],
        })

        const accessToken = jwt.sign(
            { id: user._id, username: user.username },
            config.JWT_SECRET,
            { expiresIn: "15m" }
        );

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        return res.status(201).json({
            message: "User logged in successfully",
            user: {
                username: user.username,
                email: user.email,
            },
            accessToken,
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

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
                message: "Refresh token not found"
            });
        }

        const hashedRefreshToken = crypto.createHash("sha256").update(refreshToken).digest("hex");
        const session = await SessionModel.findOne({
            refreshToken: hashedRefreshToken,
            revoked: false,
        })

        if (!session) {
            return res.status(400).json({
                message: "Invalid refresh token"
            })
        }

        session.revoked = true;
        session.revokedAt = new Date()
        await session.save();

        res.clearCookie("refreshToken");

        res.status(200).json({
            message: "Logged out successfully",
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}


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
                message: "Refresh Token not found"
            })
        }

        const decoded = jwt.verify(refreshToken, config.JWT_SECRET);

        await SessionModel.updateMany(
            { userId: decoded.id, revoked: false },
            { revoked: true, revokedAt: new Date() }
        );

        res.clearCookie("refreshToken");

        res.status(200).json({
            message: "Logged out from all devices"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

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
                message: "Token not provided!"
            })
        }

        const decoded = jwt.verify(token, config.JWT_SECRET);

        const user = await UserModel.findById(decoded.id);

        res.status(200).json({
            message: "User fetched successfully",
            user: {
                username: user.username,
                email: user.email
            }
        })

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

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
                message: "Refresh Token not found!"
            })
        }

        const decoded = jwt.verify(refreshToken, config.JWT_SECRET);

        const hashedRefreshToken = crypto.createHash("sha256").update(refreshToken).digest("hex");

        const session = await SessionModel.findOne({
            refreshToken: hashedRefreshToken,
            revoked: false
        })

        if (!session) {
            return res.status(400).json({
                message: "Invalid refresh token!"
            })
        }

        const accessToken = jwt.sign(
            { id: decoded.id, username: decoded.username },
            config.JWT_SECRET,
            { expiresIn: "15m" }
        );

        const newRefreshToken = jwt.sign(
            { id: decoded.id, username: decoded.username },
            config.JWT_SECRET,
            { expiresIn: "7d" }
        );

        const hashedNewRefreshToken = crypto.createHash("sha256").update(newRefreshToken).digest("hex");
        session.refreshToken = hashedNewRefreshToken;
        await session.save();

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            message: "Access token refreshed successfully",
            accessToken,
        })

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

export default {
    registerUserController,
    verifyUserController,
    loginUserController,
    logoutUserController,
    logoutAllUserController,
    getMe,
    rotateToken,
}