import mongoose, { Schema } from "mongoose";

const reviewSchema = new Schema({
    comment: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
}, {timestamps: true});

const ReviewModel = mongoose.model("Review", reviewSchema);

export default ReviewModel;