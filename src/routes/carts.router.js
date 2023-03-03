import { Router, json } from "express";

const cartsRouter = Router();
cartsRouter.use(json());

let carts = [];

//LECTURA GENERAL
cartsRouter.get("/", (req, res) => {
    res.send(carts);
});

//LECTURA x CID
cartsRouter.get("/:cid", (req, res) => {
    const cartID = Number(req.params.cid);
    const cart = carts.find((c) => c.cid === cartID);

    if(!cart){
        return res.status(400).send({error: `¡No existe el carrito con ID ${cartID}!`});
    }

    res.send(cart);
});

//AGREGAR
cartsRouter.post("/", (req, res) => {
    const validatorProducts = req.body.products ?? [];
    let validatorComponents = 0;
    validatorProducts.map((p) => {
        if(!p.productCode || !p.productQuantity){
            validatorComponents = validatorComponents + 1;
        }
    });
    if(validatorProducts.length < 1 || validatorComponents > 0){
        return res.status(400).send({error:"¡Missing parameters!"});
    }

    const newCart = {
        ...req.body,
        cid: carts.length, // mejorar asignacion automatica
    }

    carts = [...carts, newCart];
    res.send(newCart);
});

//MODIFICAR x CID + PID
cartsRouter.put("/:cid/product/:pid", (req, res) => {
    const cartID = Number(req.params.cid);
    const cart = carts.find((c) => c.cid === cartID);
    if(!cart){
        return res.status(400).send({error: `¡No existe el carrito con ID ${cartID}!`});
    }

    const productID = req.params.pid;
    const product = cart.products.find((p) => p.productCode === productID);
    if(!product){ //Si el producto no está en el carrito lo agrega.
        const newProduct = {
            productCode: productID,
            ...req.body
        }
    
        cart.products = [...cart.products, newProduct];
        console.log(req.body.productQuantity)
    } else { //Si el producto ya está en el carrito suma la cantidad.
        product.productQuantity = product.productQuantity + req.body.productQuantity;
        // cart.products = cart.products.map((c) => {
        //     if (c.productCode === productID){
        //         return {
        //             productCode: productID,
        //             productQuantity: c.productQuantity + req.body.productQuantity
        //         };
        //     };
        //     return c;
        // });
    }

    res.send(cart);
});

export default cartsRouter;