import chatModel from "../models/chatModel.js";

export default class chatManager {
    constructor() {
        console.log("Working with messages using database.");
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