import mongoose from "mongoose";
import { productsCollection, cartsCollection } from "../../constants/index.js";

//ESQUEMA CARRITO
const cartSchema = new mongoose.Schema({
    products: {
        type: [
            {
                productCode: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: productsCollection, //Referencia a la colección de productos.
                    required: true
                },
                productQuantity: {
                    type: Number,
                    required: true
                }
            }
        ],
        required: true,
        default: []
    }
});

//MIDDLEWARE
cartSchema.pre("findOne", function () {
    this.populate("products.productCode");
});

const cartModel = mongoose.model(cartsCollection, cartSchema);
export default cartModel;