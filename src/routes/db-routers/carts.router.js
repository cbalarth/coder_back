import {Router} from "express";
import {cartManager} from "../../dao/index.js";

const cartsRouter = Router();
const manager = new cartManager();

//LECTURA GENERAL CARRITOS
cartsRouter.get("/", async (req, res) => {
    const {limit} = req.query;
    const carts = await manager.getCarts(); //Inicia lectura general.
    const cartsLimited = carts.slice(0, Number(limit));
    
    if(limit) { //Si hay Query para limitar cantidad de resultados.
        return res.status(201).send({
            status: "Success",
            payload: cartsLimited,
        });
    }

    res.status(201).send({
        status: "Success",
        payload: carts,
    });
});

//LECTURA CARRITO x CID
cartsRouter.get("/:cid", async (req, res) => {
    const cartID = req.params.cid;
    
    try {
        const cart = await manager.getCartById(cartID); //Inicia lectura específica.
        res.status(201).send({
            status: "Success",
            data: cart,
        });
    } catch {
        res.status(401).send({
            status: `Error: ¡No existe el carrito con ID ${cartID}!`,
            data: [],
        });
    }

});

//AGREGAR CARRITO
cartsRouter.post("/", async (req, res) => {
    try {
        const newCart = await manager.addCart({ products: req.body });
        res.status(201).send({
            status: "Success",
            data: newCart,
        });
    } catch {
        res.status(401).send({
            status: "Error: ¡Parámetros no válidos o faltantes!",
            data: [],
        });
    }

});

//AGREGAR 1 PRODUCTO x PID EN CARRITO x CID
cartsRouter.put("/:cid/product/:pid", async (req, res) => {
    const cartID = req.params.cid;
    const productID = req.params.pid;
    const {productQuantity} = req.body;

    try {
        const updatedCart = await manager.updateCartUnitaryProduct(cartID, productID, productQuantity);
        res.status(201).send({
            status: "Success",
            data: updatedCart,
        });
    } catch(err) {
        res.status(401).send({
            status: `Error: ${err.message}!`,
            data: [],
        });
    }
});

//AGREGAR N PRODUCTOS EN CARRITO x CID
cartsRouter.put("/:cid", async (req, res) => {
    const cartID = req.params.cid;
    const productsArray = req.body;
    try {
        let updatedCart;
        for (const p of productsArray) {
            const productID = p.productCode;
            const productQuantity = p.productQuantity;
            updatedCart = await manager.updateCartUnitaryProduct(cartID, productID, productQuantity);
        }
        res.status(201).send({
            status: "Success",
            data: updatedCart,
        });
    } catch(err) {
        res.status(401).send({
            status: `Error: ${err.message}!`,
            data: [],
        });
    }
});

//VACIAR x CID
cartsRouter.delete("/:cid", async (req, res) => {
    const cartID = req.params.cid;

    try {
        let updatedCart = await manager.emptyCartById(cartID);
        res.status(201).send({
            status: "Success",
            data: updatedCart,
        });
    } catch {
        res.status(401).send({
            status: `Error: ¡No existe el carrito con ID ${cartID}!`,
            data: [],
        });
    }
});

export default cartsRouter;