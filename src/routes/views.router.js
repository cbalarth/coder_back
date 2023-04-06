import {Router} from "express";
import {productManager} from "../dao/index.js";
import {cartManager} from "../dao/index.js";

const viewsRouter = Router();
const pManager = new productManager();
const cManager = new cartManager();

// RENDER HOME
viewsRouter.get("/", async (req, res) => {
    res.render("home"); //Para renderizar contenido.
});

// RENDER PRODUCTOS
viewsRouter.get("/products", async (req, res) => {
    const {limit} = req.query;
    const {page} = req.query;
    const {sort} = req.query;
    const products = await pManager.getProducts(limit, page, sort); //Lectura general de productos.
    res.render("products", {products, limit : (limit ? limit : 10), sort, style: "products"}); //Para renderizar contenido.
});

// RENDER PRODUCTO X PID (POR MEJORAR, AÚN NO HACE RENDER)
viewsRouter.get("/", async (req, res) => {
    res.redirect('/products');
});
viewsRouter.get("/products/:pid", async (req, res) => {
    const {pid} = req.params;
    const product = await pManager.getProductById(pid); //Lectura de producto específico.
    res.send({ //MEJORAR -> En un futuro cambiar por un "render".
        note: "render en construcción",
        payload: product,
    });
});

// RENDER CARRITOS (POR MEJORAR, AÚN NO HACE RENDER)
viewsRouter.get("/carts", async (req, res) => {
    const carts = await cManager.getCarts(); //Lectura general de carritos.
    res.send({ //MEJORAR -> En un futuro cambiar por un "render".
        note: "render en construcción",
        payload: carts,
    });
});

// RENDER CARRITO x CID (POR MEJORAR, AÚN NO HACE RENDER)
viewsRouter.get("/carts/:cid", async (req, res) => {
    const {cid} = req.params;
    let cartProducts = (await cManager.getCartById(cid)).products; //Lectura general de productos de carrito específico.
    res.send({ //MEJORAR -> En un futuro cambiar por un "render".
        note: "render en construcción",
        payload: cartProducts,
    });
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