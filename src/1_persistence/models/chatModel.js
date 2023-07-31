import mongoose from "mongoose";
import { chatCollection } from "../../constants/index.js";

//ESQUEMA CHAT
const chatSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
});

const chatModel = mongoose.model(chatCollection, chatSchema);
export default chatModel;