import mongoose, { Schema } from "mongoose"

const otpSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User id is required"]
    },
    email: {
        type: String,
        required: [true, "Email is required"]
    },
    otpHash: {
        type: String,
        required: [true, "OTP is required"]
    },
    purpose: {
        type: String,
        enum: ["email-verification", "password-reset"],
        required: true,
    },
    attempts: {
        type: Number,
        default: 0,
    },
    expiresAt: {
        type: Date,
        default: Date.now,
        expires: 60 // 10 minutes
    }
}, { timestamps: true })

const OtpModel = mongoose.model("Otp", otpSchema);
export default OtpModel;