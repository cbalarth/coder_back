import { cartsDao } from "../1_persistence/factory.js";

export class cartService {
    //GET CARTS
    static getCarts = async () => {
        const carts = await cartsDao.getCarts();
        return carts;
    };

    //GET CART BY CID
    static getCartById = async (cartID) => {
        const cart = await cartsDao.getCartById(cartID);
        return cart;
    };

    //ADD CART
    static addCart = async (newCart) => {
        const cart = await cartsDao.addCart(newCart);
        return cart;
    };

    //UPDATE CART BY CID (MODIFY 1 PRODUCT QUANTITY or ADD 1 NEW PRODUCT)
    static updateCartUnitaryProduct = async (cartID, productID, updatedCart) => {
        const cart = await cartsDao.updateCartUnitaryProduct(cartID, productID, updatedCart);
        return cart;
    };

    //DELETE ALL PRODUCTS FROM CART BY CID
    static emptyCartById = async (cartID) => {
        const cart = await cartsDao.emptyCartById(cartID);
        return cart;
    };
};