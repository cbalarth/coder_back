import mongoose from "mongoose";

//ESQUEMA INICIAL
// const cartSchema = new mongoose.Schema({
//     products: {
//         type: Array,
//         required: true,
//     },
// });

//ESQUEMA ACTUAL
const cartSchema = new mongoose.Schema({
    products: {
        type: [
            {
                productCode: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "products",
                    required: true,
                },
                productQuantity: {
                    type: Number,
                    required: true,
                }
            }
        ],
        default: [],
    },
});

//MIDDLEWARE
cartSchema.pre("findOne", function () {
    this.populate("products.productCode");
});

const cartModel = mongoose.model("carts", cartSchema);
export default cartModel;