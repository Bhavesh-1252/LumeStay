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

if (!process.env.SMTP_USER) {
    throw new Error("SMTP user not found!");
}

if (!process.env.SMTP_PASS) {
    throw new Error("SMTP password not found!");
}

const config = {
    MONGODB_URI: process.env.MONGODB_URI,
    SESSION_SECRET: process.env.SESSION_SECRET,
    CLOUD_NAME: process.env.CLOUD_NAME,
    CLOUD_NAME: process.env.CLOUD_NAME,
    CLOUD_API_KEY: process.env.CLOUD_API_KEY,
    CLOUD_API_SECRET: process.env.CLOUD_API_SECRET,
    MAP_TOKEN: process.env.MAP_TOKEN,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
}

export default config;