import cartManager from "../components/cartManager.js";
import express from "express";

const manager = new cartManager();
const cartsRouter = express.Router();

//LECTURA GENERAL CARRITOS
cartsRouter.get("/", async (req, res) => {
    const carts = await manager.getCarts();
    const {limit} = req.query;
    const cartsLimited = carts.slice(0, Number(limit));

    if(limit) {
        return res.status(201).send({data:cartsLimited});
    }

    res.status(201).send({data:carts});
});

//LECTURA CARRITO x CID
cartsRouter.get("/:cid", async (req, res) => {
    const cartID = Number(req.params.cid);
    const cart = await manager.getCartById(cartID);

    if(!cart){
        return res.status(401).send({error: `¡No existe el carrito con ID ${cartID}!`});
    }

    res.status(201).send({data: cart});
});

//AGREGAR CARRITO
cartsRouter.post("/", async (req, res) => {
    const {
        products,
    } = req.body;


    if(!req.body.products){
        return res.status(401).send({error:"¡Missing parameters!"});
    }

    let carts = await manager.getCarts(); //Inicia lectura general.
    const index = Math.max(...carts.map(c => Number(c.cid)), 0) + 1; //Crear ID automático desde 1 en adelante y siempre siguiente al mayor valor actual.
    const newCart = await manager.addCart(
        index,
        products
    );

    carts = await manager.getCarts(); //Actualiza lectura general.
    const indexOfNewCart = carts.findIndex((c) => c.cid == index);
    res.status(201).send({data: carts[indexOfNewCart]});
});

//AGREGAR PRODUCTO EN CARRITO x CID + PID
cartsRouter.put("/:cid/product/:pid", async (req, res) => {
    const cartID = Number(req.params.cid);
    const productID = req.params.pid;
    
    let cart = await manager.getCartById(cartID); //Inicia lectura específica.
    if(!cart){
        return res.status(401).send({error: `¡No existe el carrito con ID ${cartID}!`});
    }

    await manager.updateCart(cartID, productID, req.body);
    cart = await manager.getCartById(cartID); //Actualizar lectura específica.
    res.status(201).send({data: cart});
});

export default cartsRouter;