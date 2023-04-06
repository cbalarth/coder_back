import {Router} from "express";
import {productManager} from "../../dao/index.js";

const productsRouter = Router();
const manager = new productManager();

//LECTURA GENERAL PRODUCTOS
productsRouter.get("/", async (req, res) => {
    const {limit, page, sort, category, status} = req.query;
    const products = await manager.getProducts(limit, page, sort, category, status); //Inicia lectura general.

    res.status(201).send({
        status: "Success",
        payload: products.docs,
        totalPages: products.totalPages,
        prevPage: products.prevPage,
        nextPage: products.nextPage,
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        prevLink: products.hasPrevPage ? `http://localhost:8080/api/products?`+(limit ? `limit=${limit}&` : "")+(sort ? `sort=${sort}&` : "")+`page=${products.prevPage}` : null,
        nextLink: products.hasNextPage ? `http://localhost:8080/api/products?`+(limit ? `limit=${limit}&` : "")+(sort ? `sort=${sort}&` : "")+`page=${products.nextPage}` : null,
    });
});

//LECTURA PRODUCTO x PID
productsRouter.get("/:pid", async (req, res) => {
    const productID = req.params.pid;
    
    try {
        const product = await manager.getProductById(productID); //Inicia lectura específica.
        res.status(201).send({
            status: "Success",
            data: product,
        });
    } catch {
        res.status(401).send({
            status: `Error: ¡No existe el producto con ID ${productID}!`,
            data: [],
        });
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
        res.status(201).send({
            status: "Success",
            data: newProduct,
        });
    } catch {
        res.status(401).send({
            status: "Error: ¡Parámetros no válidos o faltantes!",
            data: [],
        });
    }

});

//MODIFICAR x PID
productsRouter.put("/:pid", async (req, res) => {
    const productID = req.params.pid;

    try {
        const updatedProduct = await manager.updateProduct(productID, req.body);
        res.status(201).send({
            status: "Success",
            data: updatedProduct,
        });
    } catch(err) {
        res.status(401).send({
            status: `Error: ${err.message}`,
            data: [],
        });
    }
});

//ELIMINAR x PID
productsRouter.delete("/:pid", async (req, res) => {
    const productID = req.params.pid;
    try {
        const deletion = await manager.deleteProduct(productID);
        res.status(201).send({
            status: "Success",
            data: deletion,
        });
    } catch {
        res.status(401).send({
            status: `Error: ¡No existe el producto con ID ${productID}!`,
            data: [],
        });
    }
});

export default productsRouter;