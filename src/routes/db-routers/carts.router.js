import {Router} from "express";
import {cartManager} from "../../dao/index.js";

const cartsRouter = Router();
const manager = new cartManager();

//LECTURA GENERAL CARRITOS
cartsRouter.get("/", async (req, res) => {
    const carts = await manager.getCarts(); //Inicia lectura general.

    const {limit} = req.query;
    const cartsLimited = carts.slice(0, Number(limit));
    if(limit) { //Si hay Query para limitar cantidad de resultados.
        return res.status(201).send({data:cartsLimited});
    }

    res.status(201).send({
        status: "success",
        payload: carts,
    });
});

//LECTURA CARRITO x PID
cartsRouter.get("/:pid", async (req, res) => {
    const cartID = req.params.pid;
    
    try {
        const cart = await manager.getCartById(cartID); //Inicia lectura específica.
        res.status(201).send({data: cart});
    } catch {
        res.status(401).send({error: `¡No existe el carrito con ID ${cartID}!`});
    }

});

//AGREGAR CARRITO
cartsRouter.post("/", async (req, res) => {
    try {
        const newCart = await manager.addCart({
            products: req.body,
        });
        res.status(201).send({data: newCart});
    } catch(err) {
        res.status(401).send(err.message);
    }

});

//AGREGAR PRODUCTO EN CARRITO x CID + PID
cartsRouter.put("/:cid/product/:pid", async (req, res) => {
    const cartID = req.params.cid;
    const productID = req.params.pid;

    try {
        let updatedCart = await manager.updateCart(cartID, productID, req.body.productQuantity);
        res.status(201).send({data: updatedCart});
    } catch(err) {
        res.status(401).send(err.message);
    }
});

//VACIAR x CID
cartsRouter.delete("/:cid", async (req, res) => {
    const cartID = req.params.cid;

    try {
        let updatedCart = await manager.emptyCartById(cartID);
        res.status(201).send({data: updatedCart});
    } catch(err) {
        res.status(401).send(err.message);
    }
});

export default cartsRouter;