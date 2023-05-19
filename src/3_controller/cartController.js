import { cartService } from "../2_service/cartService.js";

export class cartController {
    //GET CARTS
    static getCarts = async (req, res) => {
        try {
            const { limit } = req.query;
            const carts = await cartService.getCarts(); //Inicia lectura general.
            const cartsLimited = carts.slice(0, Number(limit));

            if (limit) { //Si hay Query para limitar cantidad de resultados.
                return res.status(201).send({ status: "Success", payload: cartsLimited });
            }

            res.status(201).send({ status: "Success", payload: carts });
        } catch (err) {
            res.status(401).send({ status: "Failure", error: err.message });
        }
    };

    //GET CART BY CID
    static getCartById = async (req, res) => {
        try {
            const cart = await cartService.getCartById(req.params.cid); //Inicia lectura específica.
            res.status(201).send({ status: "Success", payload: cart });
        } catch (err) {
            res.status(401).send({ status: "Failure", error: err.message });
        }
    };

    //ADD CART
    static addCart = async (req, res) => {
        try {
            const newCart = await cartService.addCart({ products: req.body });
            res.status(201).send({ status: "Success", payload: newCart });
        } catch (err) {
            res.status(401).send({ status: "Failure", error: err.message });
        }
    };

    //UPDATE CART BY CID (MODIFY 1 PRODUCT QUANTITY or ADD 1 NEW PRODUCT)
    static updateCartUnitaryProduct = async (req, res) => {
        try {
            const cartID = req.params.cid;
            const productID = req.params.pid;
            const body = req.body;
            let updatedCart;

            if (productID) {
                updatedCart = await cartService.updateCartUnitaryProduct(cartID, productID, body.productQuantity);
            } else {
                for (const p of body) {
                    updatedCart = await cartService.updateCartUnitaryProduct(cartID, p.productCode, p.productQuantity);
                }
            }

            res.status(201).send({ status: "Success", payload: updatedCart });
        } catch (err) {
            res.status(401).send({ status: "Failure", error: err.message });
        }
    };

    //DELETE ALL PRODUCTS FROM CART BY CID
    static emptyCartById = async (req, res) => {
        try {
            const updatedCart = await cartService.emptyCartById(req.params.cid);
            res.status(201).send({ status: "Success", payload: updatedCart });
        } catch (err) {
            res.status(401).send({ status: "Failure", error: err.message });
        }
    };
};