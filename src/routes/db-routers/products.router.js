import {Router} from "express";
import {productManager} from "../../dao/index.js";

const productsRouter = Router();
const manager = new productManager();

//LECTURA GENERAL PRODUCTOS
productsRouter.get("/", async (req, res) => {
    const products = await manager.getProducts(); //Inicia lectura general.

    const {limit} = req.query;
    const productsLimited = products.slice(0, Number(limit));
    if(limit) { //Si hay Query para limitar cantidad de resultados.
        return res.status(201).send({data:productsLimited});
    }

    res.status(201).send({data:products});
});

//LECTURA PRODUCTO x PID
productsRouter.get("/:pid", async (req, res) => {
    const productID = req.params.pid;
    
    try {
        const product = await manager.getProductById(productID); //Inicia lectura específica.
        res.status(201).send({data: product});
    } catch {
        res.status(401).send({error: `¡No existe el producto con ID ${productID}!`});
    }

});

//AGREGAR PRODUCTO
productsRouter.post("/", async (req, res) => {
    const {
        title,
        description,
        code,
        price,
        stock,
        category,
    } = req.body;

    try {
        const newProduct = await manager.addProduct({
            title,
            description,
            code,
            price,
            stock,
            category,
        });
        res.status(201).send({data: newProduct});
    } catch(err) {
        res.status(401).send(err.message);
    }

});

//MODIFICAR x PID
productsRouter.put("/:pid", async (req, res) => {
    const productID = req.params.pid;

    try {
        let updatedProduct = await manager.updateProduct(productID, req.body);
        res.status(201).send({data: updatedProduct});
    } catch(err) {
        res.status(401).send(err.message);
    }
});

//ELIMINAR x ID
productsRouter.delete("/:pid", async (req, res) => {
    const productID = req.params.pid;
    try {
        let deletion = await manager.deleteProduct(productID);
        res.status(201).send({data: deletion});
    } catch {
        res.status(401).send({error: `¡No existe el producto con ID ${productID}!`});
    }
});

export default productsRouter;