import {Router} from "express";
import productManager from "../components/productManager.js";

const viewsRouter = Router();
const manager = new productManager();
const products = await manager.getProducts(); //Inicia lectura general.

viewsRouter.get("/", (req, res) => {
    res.render("index", {products, style: "index"}); //Para renderizar contenido.
    // res.send(products);
});

viewsRouter.get("/realtimeproducts", (req, res) => {
    res.render("realtimeproducts", {style: "realtimeproducts"}); //Para renderizar contenido.
    // res.send(products);
});

export default viewsRouter;