import chatModel from "../models/chatModel.js";

export class chatManager {
    constructor() {
        console.log("Working with MESSAGES using database in MongoDB.");
    }

    getMessages = async () => {
        const result = await chatModel.find().lean();
        return result;
    };

    saveMessage = async (newMessage) => {
        const result = await chatModel.create(newMessage);
        return result;
    };
}