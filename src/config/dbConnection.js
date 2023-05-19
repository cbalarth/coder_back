import mongoose from "mongoose";
import { options } from "./options.js";

export const connectDB = async () => {
    try {
        await mongoose.connect(options.database.url);
        console.log("Connected to database in MongoDB.");
    } catch (error) {
        console.log(`Connection error to database in MongoDB: ${error.message}`);
    }
}