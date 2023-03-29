import cartModel from "../models/cartModel.js";

export default class cartManager {
    constructor() {
        console.log("Working with carts using database.");
    }

    getCarts = async () => {
        const result = await cartModel.find().lean();
        return result;
    };

    addCart = async (newCart) => {
        const result = await cartModel.create(newCart);
        return result;
    };

    getCartById = async (cartID) => {
        const result = await cartModel.findOne({_id: cartID}).lean();
        return result;
    };
    
    updateCart = async (cartID, productID, updatedCart) => {
        let cart = await cartModel.findOne({_id: cartID},).lean();
        let validation1 = await cartModel.findOne({_id: cartID}).lean();
        let validation2 = await cartModel.findOne({_id: cartID, "products.productCode": Number(productID)}).lean();

        if(validation2){
            let index = Number(cart.products.findIndex((p) => p.productCode == Number(productID)));
            let currentQ = cart.products[index].productQuantity;
            const result = await cartModel.updateOne(
                {_id: cartID, "products.productCode": Number(productID)},
                {$set: {"products.$.productQuantity": currentQ+updatedCart}},
                {new: true}
                ).lean();
            cart = await cartModel.findOne({_id: cartID}).lean();
            return cart;
        } else if (validation1){
            const result = await cartModel.updateOne(
                {_id: cartID},
                {$push: {products: {
                    productCode: Number(productID),
                    productQuantity: updatedCart,
                }}},
                {new: true}
                ).lean();
            cart = await cartModel.findOne({_id: cartID}).lean();
            return cart;
        }
    };
};