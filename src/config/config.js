import dotenv from "dotenv";

dotenv.config();

if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB URI not found!");
}

if (!process.env.SESSION_SECRET) {
    throw new Error("Secret Not found!");
}

const config = {
    MONGODB_URI: process.env.MONGODB_URI,
    SESSION_SECRET: process.env.SESSION_SECRET
}

export default config;