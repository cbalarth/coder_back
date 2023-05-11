import {Router} from "express";
import {productManager} from "../../config/persistenceConfig.js";

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
    const productID = Number(req.params.pid);
    const product = await manager.getProductById(productID); //Inicia lectura específica.

    if(!product){ //Si no existe el producto con ese ID.
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


    if(!req.body.title || !req.body.description || !req.body.code || !req.body.price || !req.body.stock || !req.body.category){ //Si falta alguno de los campos obligatorios.
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
    const product = await manager.getProductById(index); //Inicia lectura específica.
    res.status(201).send({data: product});
});

//MODIFICAR x PID
productsRouter.put("/:pid", async (req, res) => {
    const productID = Number(req.params.pid);
    let product = await manager.getProductById(productID); //Inicia lectura específica.

    if(!product){ //Si no existe el producto con ese ID.
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