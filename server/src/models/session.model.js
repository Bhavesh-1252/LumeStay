import mongoose, {Schema} from "mongoose"

const sessionSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is required"]
    },
    refreshToken: {
        type: String,
        required: [true, "refresh token is required"]
    },
    ip: {
        type: String,
        required: [true, "ip is required"]
    },
    userAgent: {
        type: String,
        required: [true, "user agent is required"]
    },
    revoked: {
        type: Boolean,
        default: false
    },
    revokedAt: {
        type: Date,
        default: null,
        expires: 10
    }
},{timestamps: true})

const SessionModel = mongoose.model("Session", sessionSchema);
export default SessionModel;