import mongoose, { Schema } from "mongoose"
import ppLocalMongoose from "passport-local-mongoose"

const passportLocalMongoose = ppLocalMongoose.default;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);

export default User;