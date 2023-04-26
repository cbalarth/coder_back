import mongoose from "mongoose";

const collectionName = "users";
const userSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true
    },
    email: {
        type: String,
        unique:true,
        required:true
    },
    password: {
        type:String,
        required:true
    },
    role: {
        type: String,
        required:true,
        enum:["usuario", "admin"],
        default: 'usuario',
    }
});

const userModel = mongoose.model(collectionName, userSchema);
export default userModel;