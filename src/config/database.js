import mongoose from "mongoose";

const dbUrl = process.env.MONGODB_URI
export default async function connectDB() {
    try {
        await mongoose.connect(`${dbUrl}lumestay`)
        console.log("Database connected successfully");
    }
    catch (err) {
        console.log("Error in database connection: ", err);
    }
}