import mongoose from "mongoose";

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

const chatModel = mongoose.model("messages", chatSchema);
export default chatModel;