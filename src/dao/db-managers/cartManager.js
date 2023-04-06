import cartModel from "../models/cartModel.js";

export default class cartManager {
    constructor() {
        console.log("Working with carts using database.");
    }

    //GET CARTS
    getCarts = async () => {
        const result = await cartModel.find().lean();
        return result;
    };

    //ADD CART
    addCart = async (newCart) => {
        const result = await cartModel.create(newCart);
        return result;
    };

    //GET CART BY CID
    getCartById = async (cartID) => {
        const result = await cartModel.findOne({_id: cartID}).lean(); //Inicia lectura específica.
        return result;
    };
    
    //UPDATE CART BY CID (MODIFY 1 PRODUCT QUANTITY or ADD 1 NEW PRODUCT)
    updateCartUnitaryProduct = async (cartID, productID, updatedCart) => {
        let validation1 = await cartModel.findOne({_id: cartID}).lean(); //Valida si el carrito existe.
        let validation2 = await cartModel.findOne({_id: cartID, "products.productCode": productID}).lean(); //Valida si el carrito existe y ya tiene el producto.

        //MODIFY 1 PRODUCT QUANTITY
        if(validation2){
            const result = await cartModel.findOneAndUpdate(
                {_id: cartID, "products.productCode": productID},
                {$inc: {"products.$.productQuantity": updatedCart}},
                {new: true}
                ).lean();
            return result;
        //ADD 1 NEW PRODUCT
        } else if (validation1){
            const result = await cartModel.findOneAndUpdate(
                {_id: cartID},
                {$push: {products: {
                    productCode: productID,
                    productQuantity: updatedCart,
                }}},
                {new: true}
                ).lean();
            return result;
        }
    };

    //DELETE PRODUCTS FROM CART BY CID
    emptyCartById = async (cartID) => {
        const result = await cartModel.findOneAndUpdate(
            {_id: cartID},
            {$set: {"products": []}},
            {new: true}
            ).lean();
        return result;
    };
};