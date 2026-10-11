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
    }
}, {timestamps: true})

const OtpModel = mongoose.model("Otp", otpSchema);
export default OtpModel;