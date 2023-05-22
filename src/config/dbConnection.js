import mongoose from "mongoose";
import { options } from "./options.js";

export const connectDB = async () => {
    try {
        await mongoose.connect(options.database.url);
        console.log("DBCONNECTION.JS | Connected DB");
    } catch (error) {
        console.log(`DBCONNECTION.JS | Connection Error: ${error.message}`);
    }
}