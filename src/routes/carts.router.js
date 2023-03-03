import { Router, json } from "express";

const cartsRouter = Router();
cartsRouter.use(json());

let carts = [];

cartsRouter.get("/", (req, res) => {
    res.send(carts);
});

cartsRouter.get("/:id", (req, res) => {
    const cartID = Number(req.params.id);
    const cart = carts.find((c) => c.id === cartID);
    if(!cart){
        return res.status(400).send({error: `¡No existe el carrito con ID ${cartID}!`});
    }
    res.send(cart);
});

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
        id: carts.length, // mejorar asignacion automatica
    }

    carts = [...carts, newCart];
    res.send(newCart);
});

export default cartsRouter;