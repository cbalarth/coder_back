import {Router} from "express";
import {productManager} from "../dao/index.js";
// import productModel from "../dao/models/productModel.js"; //Verificar si se necesita!!!

const viewsRouter = Router();
const manager = new productManager();

// RENDER PRODUCTOS
viewsRouter.get("/", async (req, res) => {
    const products = await manager.getProducts(); //Inicia lectura general.
    res.render("index", {products, style: "index"}); //Para renderizar contenido.
});

// RENDER PRODUCTOS EN VIVO
viewsRouter.get("/realtimeproducts", (req, res) => {
    res.render("realtimeproducts", {style: "realtimeproducts"}); //Para renderizar contenido.
});

export default viewsRouter;