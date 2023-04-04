import {Router} from "express";
import {productManager} from "../dao/index.js";
// import productModel from "../dao/models/productModel.js"; //Verificar si se necesita!!!

const viewsRouter = Router();
const manager = new productManager();

// RENDER PRODUCTOS
viewsRouter.get("/", async (req, res) => {
    const {limit} = req.query;
    const {page} = req.query;
    const {sort} = req.query;
    const products = await manager.getProducts(limit, page, sort); //Inicia lectura general.
    res.render("index", {products, limit, sort, style: "index"}); //Para renderizar contenido.
});

// RENDER PRODUCTOS EN VIVO
viewsRouter.get("/realtimeproducts", (req, res) => {
    res.render("realtimeproducts", {style: "realtimeproducts"}); //Para renderizar contenido.
});

// RENDER CHAT
viewsRouter.get("/chat", (req, res) => {
    res.render("chat", { style: "chat"}); //Para renderizar contenido.
});

export default viewsRouter;