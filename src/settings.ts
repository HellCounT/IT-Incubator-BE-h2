import dotenv from "dotenv";
dotenv.config()

export const settings = {
    JWT_SECRET: process.env.JWT_SECRET || "fake",
    MONGO_URI: process.env.MONGO_URL || "",
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD || "fake"
}