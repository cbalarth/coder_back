import mongoose from "mongoose";
import { cartsCollection, usersCollection } from "../../constants/index.js";

//ESQUEMA USUARIO
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
        ref: cartsCollection //Referencia a la colección de carritos.
    },
    role: {
        type: String,
        enum: ["user", "premium", "admin"],
        required: true,
        default: "user"
    },
    documents: {
        type: [
            {
                name: { type: String, required: true },
                reference: { type: String, required: true }
            }
        ],
        default: []
    },
    last_connection: {
        type: Date,
        default: null
    },
    status: {
        type: String,
        required: true,
        enums: ["pendiente", "incompleto", "completo"],
        default: "pendiente"
    },
    avatar: {
        type: String,
        default: ""
    }
});

//MIDDLEWARE
userSchema.pre("findOne", function () {
    this.populate("cart");
});

const userModel = mongoose.model(usersCollection, userSchema);
export default userModel;