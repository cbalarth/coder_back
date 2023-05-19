import mongoose from "mongoose";
import { cartsCollection, usersCollection } from "../../constants/index.js";

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: cartsCollection
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        required: true,
        default: "user"
    }
});

const userModel = mongoose.model(usersCollection, userSchema);
export default userModel;