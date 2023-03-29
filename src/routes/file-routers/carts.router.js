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

    res.status(201).send({data:carts});
});

//LECTURA CARRITO x CID
cartsRouter.get("/:cid", async (req, res) => {
    const cartID = Number(req.params.cid);
    const cart = await manager.getCartById(cartID); //Inicia lectura específica.

    if(!cart){ //Si no existe el carrito con ese ID.
        return res.status(401).send({error: `¡No existe el carrito con ID ${cartID}!`});
    }

    res.status(201).send({data: cart});
});

//AGREGAR CARRITO
cartsRouter.post("/", async (req, res) => {
    const {
        products,
    } = req.body;


    if(!req.body.products){ //Si falta alguno de los campos obligatorios.
        return res.status(401).send({error:"¡Missing parameters!"});
    }

    let carts = await manager.getCarts(); //Inicia lectura general.
    const index = Math.max(...carts.map(c => Number(c.cid)), 0) + 1; //Crear ID automático desde 1 en adelante y siempre siguiente al mayor valor actual.
    const newCart = await manager.addCart(
        index,
        products
    );

    carts = await manager.getCarts(); //Actualiza lectura general.
    const cart = await manager.getCartById(index); //Inicia lectura específica.
    res.status(201).send({data: cart});
});

//AGREGAR PRODUCTO EN CARRITO x CID + PID
cartsRouter.put("/:cid/product/:pid", async (req, res) => {
    const cartID = Number(req.params.cid);
    const productID = req.params.pid;
    
    let cart = await manager.getCartById(cartID); //Inicia lectura específica.
    if(!cart){ //Si no existe el carrito con ese ID.
        return res.status(401).send({error: `¡No existe el carrito con ID ${cartID}!`});
    }

    await manager.updateCart(cartID, productID, req.body);
    cart = await manager.getCartById(cartID); //Actualizar lectura específica.
    res.status(201).send({data: cart});
});

export default cartsRouter;