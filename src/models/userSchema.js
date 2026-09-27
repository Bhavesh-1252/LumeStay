import mongoose, { Schema } from "mongoose"
import ppLocalMongoose from "passport-local-mongoose"
import crypto from "crypto";

const passportLocalMongoose = ppLocalMongoose.default;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    verificationToken: String,
    verificationTokenExpiry: Date,
});

// Generate token to verify user
userSchema.methods.generateVerifyToken = function () {
    const token = crypto.randomBytes(32).toString("hex");
    this.verificationToken = token,
    this.verificationTokenExpiry = Date.now() + 30 * 60 * 1000; // 30 minutes
    return token;
}

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);

export default User;