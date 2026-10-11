import mongoose, { Schema } from "mongoose"

const userSchema = new Schema({
    username: {
        type: String,
        unique: [true, "username already already taken"],
        required: true,
    },
    email: {
        type: String,
        unique: [true, "Account already exists with this email address"],
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    verified: {
        type: Boolean,
        default: false,
    },
});

// userSchema.plugin(passportLocalMongoose);

const UserModel = mongoose.model('User', userSchema);

export default UserModel;