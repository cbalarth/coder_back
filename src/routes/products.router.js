import productManager from "../components/productManager.js";
import express from "express";

const manager = new productManager();
const productsRouter = express.Router();

//LECTURA GENERAL PRODUCTOS
productsRouter.get("/", async (req, res) => {
    const products = await manager.getProducts();
    const {limit} = req.query;
    const productsLimited = products.slice(0, Number(limit));

    if(limit) {
        return res.status(201).send({data:productsLimited});
    }

    res.status(201).send({data:products});
});

//LECTURA PRODUCTO x PID
productsRouter.get("/:pid", async (req, res) => {
    const productID = Number(req.params.pid);
    const product = await manager.getProductById(productID);

    if(!product){
        return res.status(401).send({error: `¡No existe el producto con ID ${productID}!`});
    }

    res.status(201).send({data: product});
});

//AGREGAR PRODUCTO
productsRouter.post("/", async (req, res) => {
    const {
        title,
        description,
        code,
        price,
        status = true,
        stock,
        category,
        thumbnails = [],
    } = req.body;


    if(!req.body.title || !req.body.description || !req.body.code || !req.body.price || !req.body.stock || !req.body.category){
        return res.status(401).send({error:"¡Missing parameters!"});
    }

    let products = await manager.getProducts(); //Inicia lectura general.
    const index = Math.max(...products.map(p => Number(p.pid)), 0) + 1; //Crear ID automático desde 1 en adelante y siempre siguiente al mayor valor actual.
    const newProduct = await manager.addProduct(
        index,
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails
    );

    products = await manager.getProducts(); //Actualiza lectura general.
    const indexOfNewProduct = products.findIndex((p) => p.pid == index);
    res.status(201).send({data: products[indexOfNewProduct]});
});

//MODIFICAR x PID
productsRouter.put("/:pid", async (req, res) => {
    const productID = Number(req.params.pid);
    let product = await manager.getProductById(productID); //Inicia lectura específica.

    if(!product){
        return res.status(401).send({error: `¡No existe el producto con ID ${productID}!`});
    }
    
    await manager.updateProduct(productID, req.body);
    product = await manager.getProductById(productID); //Actualizar lectura específica.
    res.status(201).send({data: product});
});

//ELIMINAR x ID
productsRouter.delete("/:pid", async (req, res) => {
    const productID = Number(req.params.pid);
    await manager.deleteProduct(productID);
    const products = await manager.getProducts(); //Inicia lectura general.
    res.status(201).send(products);
});

export default productsRouter;