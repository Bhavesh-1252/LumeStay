import mongoose, { Schema } from "mongoose";
import Review from "./review.model.js";

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        url: String,
        filename: String,
        publicId: String,
    },
    price: {
        type: Number,
        required: true,
    },
    country: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        requied: true
    },
    // geometry: {
    //     type: {
    //         type: String, // Don't do `{ location: { type: String } }`
    //         enum: ['Point'], // 'location.type' must be 'Point'
    //         required: true
    //     },
    //     coordinates: {
    //         type: [Number],
    //         required: true
    //     }
    // }
});

// Deleting all the dependent Review for that particular listing which is deleted
listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing.reviews.length) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
})

const ListingModel = mongoose.model("Listing", listingSchema);

export default ListingModel;