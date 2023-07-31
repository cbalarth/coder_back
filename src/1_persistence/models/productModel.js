import mongoose from "mongoose";
// import mongoosePaginate from "mongoose-paginate-v2";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import { productsCollection } from "../../constants/index.js";

//ESQUEMA PRODUCTO
const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: Number,
        required: true
    },
    status: {
        type: Boolean,
        required: true,
        default: true
    },
    stock: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    thumbnails: {
        type: Array,
        required: true,
        default: []
    },
    owner: {
        type: String,
        default: "admin"
    }
});

// productSchema.plugin(mongoosePaginate);
productSchema.plugin(aggregatePaginate); //Integra la funcionalidad de Paginate para este Schema/Model.

const productModel = mongoose.model(productsCollection, productSchema);
export default productModel;