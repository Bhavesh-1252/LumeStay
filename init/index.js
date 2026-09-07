const mongoose = require("mongoose")
const initData = require("./data.js")
const Listing = require("../models/listing.js")

const MONGODB_URI = "mongodb://localhost:27017/"
async function connectdb() {
    try {
        await mongoose.connect(`${MONGODB_URI}wanderlust`)
        console.log("Database connected successfully");
    }
    catch (err) {
        console.log("Error in database connection: ", err);
    }
}

connectdb();

const initDB = async () => {
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("Data was initialized")
}

initDB();