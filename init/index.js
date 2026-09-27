import Listing from "../src/models/listingSchema.js"
import mongoose from "mongoose"
import initData from "./data.js"

const MONGODB_URI = "mongodb://localhost:27017/"
async function connectdb() {
    try {
        await mongoose.connect(`${MONGODB_URI}lumestay`)
        console.log("Database connected successfully");
    }
    catch (err) {
        console.log("Error in database connection: ", err);
    }
}

connectdb();

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({
        ...obj,
        owner: "6a9d69e0b5febba5bc00a95c"
    }));
    await Listing.insertMany(initData.data);
    console.log("Data was initialized")
}

initDB();
