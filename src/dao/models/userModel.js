import mongoose from "mongoose";

const collectionName = "users";
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
        ref: "carts"
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        required: true,
        default: "user"
    }
});

const userModel = mongoose.model(collectionName, userSchema);
export default userModel;