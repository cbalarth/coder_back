import { Router, json } from "express";

const productsRouter = Router();
productsRouter.use(json());

let products = [];

productsRouter.get("/", (req, res) => {
    res.send(products);
});

productsRouter.get("/:id", (req, res) => {
    const productID = Number(req.params.id);
    const product = products.find((p) => p.id === productID);
    if(!product){
        return res.status(400).send({error: `¡No existe el producto con ID ${productID}!`});
    }
    res.send(product);
});

productsRouter.post("/", (req, res) => {

    if(!req.body.title || !req.body.description || !req.body.code || !req.body.price || !req.body.status || !req.body.stock || !req.body.category || !req.body.thumbnails){
        return res.status(400).send({error:"¡Missing parameters!"});
    }

    const newProduct = {
        ...req.body,
        id: products.length, // mejorar asignacion automatica
    }

    products = [...products, newProduct];
    res.send(newProduct);
});

export default productsRouter;