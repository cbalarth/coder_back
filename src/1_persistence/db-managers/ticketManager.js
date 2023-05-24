import ticketModel from "../models/ticketModel.js";

export class ticketManager {
    constructor(model) {
        this.model = model;
        console.log("TICKETMANAGER.JS | TICKETS Connected DB");
    };

    //ADD TICKET
    addTicket = async (ticket) => {
        try {
            const data = await ticketModel.create(ticket);
            const response = JSON.parse(JSON.stringify(data));
            return response;
        } catch (error) {
            throw new Error(`ERROR ADDING NEW TICKET: ${error.message}`);
        }
    };
}