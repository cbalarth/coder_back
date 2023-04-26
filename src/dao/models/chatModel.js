import mongoose from "mongoose";

const collectionName = "messages";
const chatSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
});

const chatModel = mongoose.model(collectionName, chatSchema);
export default chatModel;