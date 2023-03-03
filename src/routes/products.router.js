import { Router, json } from "express";

const productsRouter = Router();
productsRouter.use(json());

let products = [];

//LECTURA GENERAL
productsRouter.get("/", (req, res) => {
    res.send(products);
});

//LECTURA x PID
productsRouter.get("/:pid", (req, res) => {
    const productID = Number(req.params.pid);
    const product = products.find((p) => p.pid === productID);

    if(!product){
        return res.status(400).send({error: `¡No existe el producto con ID ${productID}!`});
    }

    res.send(product);
});

//AGREGAR
productsRouter.post("/", (req, res) => {
    if(!req.body.title || !req.body.description || !req.body.code || !req.body.price || !req.body.status || !req.body.stock || !req.body.category || !req.body.thumbnails){
        return res.status(400).send({error:"¡Missing parameters!"});
    }

    const newProduct = {
        ...req.body,
        pid: products.length, // mejorar asignacion automatica
    }

    products = [...products, newProduct];
    res.send(newProduct);
});

//MODIFICAR x PID
productsRouter.put("/:pid", (req, res) => {
    if(!req.body.title || !req.body.description || !req.body.code || !req.body.price || !req.body.status || !req.body.stock || !req.body.category || !req.body.thumbnails){
        return res.status(400).send({error:"¡Missing parameters!"});
    }

    const productID = Number(req.params.pid);
    const product = products.find((p) => p.pid === productID);
    if(!product){
        return res.status(400).send({error: `¡No existe el producto con ID ${productID}!`});
    }
    

    products = products.map((p) => {
        if (p.pid === productID){
            return {
                ...req.body,
                pid: p.pid,
            };
        };
        return p;
    });

    res.send(product);
});

//ELIMINAR x ID
productsRouter.delete("/:pid", (req, res) => {
    const productID = Number(req.params.pid);
    products = products.filter((p) => p.pid !== productID);
    res.send(products);
});

export default productsRouter;