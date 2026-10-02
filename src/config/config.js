import dotenv from "dotenv";

dotenv.config();

if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB URI not found!");
}

if (!process.env.SESSION_SECRET) {
    throw new Error("Secret not found!");
}

if (!process.env.CLOUD_NAME) {
    throw new Error("Cloudinary folder not found!")
}

if (!process.env.CLOUD_API_KEY) {
    throw new Error("Cloudinary key not found!")
}

if (!process.env.CLOUD_API_SECRET) {
    throw new Error("Cloudinary secret not found!")
}

if (!process.env.MAP_TOKEN) {
    throw new Error("Map token not found!")
}

if (!process.env.GOOGLE_EMAIL_USER) {
    throw new Error("GOOGLE EMAIL USER not found!");
}

if (!process.env.GOOGLE_CLIENT_ID) {
    throw new Error("GOOGLE CLIENT ID not found!");
}

if (!process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error("GOOGLE CLIENT SECRET not found!");
}

if (!process.env.GOOGLE_REFRESH_TOKEN) {
    throw new Error("GOOGLE REFRESH TOKEN not found!");
}

const config = {
    MONGODB_URI: process.env.MONGODB_URI,
    SESSION_SECRET: process.env.SESSION_SECRET,
    CLOUD_NAME: process.env.CLOUD_NAME,
    CLOUD_API_KEY: process.env.CLOUD_API_KEY,
    CLOUD_API_SECRET: process.env.CLOUD_API_SECRET,
    MAP_TOKEN: process.env.MAP_TOKEN,
    GOOGLE_EMAIL_USER: process.env.GOOGLE_EMAIL_USER,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_REFRESH_TOKEN: process.env.GOOGLE_REFRESH_TOKEN,
}

export default config;