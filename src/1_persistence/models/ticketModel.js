import mongoose from "mongoose";
import { ticketsCollection } from "../../constants/index.js";

const ticketSchema = new mongoose.Schema({
    code: {
        type: String,
        unique: true,
        required: true
    },
    purchase_datetime: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    purchaser: {
        type: String,
        required: true
    }
});

const ticketModel = mongoose.model(ticketsCollection, ticketSchema);
export default ticketModel;