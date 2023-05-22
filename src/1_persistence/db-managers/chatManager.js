import chatModel from "../models/chatModel.js";

export class chatManager {
    constructor() {
        console.log("CHATMANAGER.JS | MESSAGES Connected DB");
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