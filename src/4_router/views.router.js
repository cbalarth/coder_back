import { Router } from "express";
import { productManager } from "../config/persistenceConfig.js";
import { cartManager } from "../config/persistenceConfig.js";
import passport from "passport";

const viewsRouter = Router();
const pManager = new productManager();
const cManager = new cartManager();

// RENDER HOME
viewsRouter.get("/", async (req, res) => {
    res.render("home", { style: "home" }); //Para renderizar contenido.
});

// RENDER PRODUCTOS
viewsRouter.get("/products", (req, res, next) => {
    passport.authenticate("authJWT", { session: false }, async (err, user) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).send({ message: "Usuario no logueado 1." });
        }
        const { limit, page, sort, category, status } = req.query;
        const products = await pManager.getProducts(limit, page, sort, category, status);
        const userEmail = user.email;
        const isAdmin = (user.role == "admin");
        return res.render("products", { products, limit: (limit ? limit : 10), sort, category, status, userEmail, isAdmin, style: "products" });
    })(req, res, next);
});

// RENDER PRODUCTO X PID (POR MEJORAR, AÚN NO HACE RENDER)
viewsRouter.get("/products/:pid", async (req, res) => {
    const { pid } = req.params;
    const product = await pManager.getProductById(pid); //Lectura de producto específico.
    // res.send({ //MEJORAR -> En un futuro cambiar por un "render".
    //     note: "render en construcción",
    //     status: "Success",
    //     payload: product,
    // });
    res.render("product", { product, style: "products" }); //Para renderizar contenido.
});

// RENDER CARRITOS (POR MEJORAR, AÚN NO HACE RENDER)
viewsRouter.get("/carts", async (req, res) => {
    const carts = await cManager.getCarts(); //Lectura general de carritos.
    res.send({ //MEJORAR -> En un futuro cambiar por un "render".
        note: "render en construcción",
        status: "Success",
        payload: carts,
    });
});

// RENDER CARRITO x CID
viewsRouter.get("/carts/:cid", async (req, res) => {
    const { cid } = req.params;
    let cartProducts = (await cManager.getCartById(cid)).products; //Lectura general de productos de carrito específico.
    res.render("cart", { cid, cartProducts, style: "products" }); //Para renderizar contenido.
});

// RENDER PRODUCTOS EN VIVO
viewsRouter.get("/realtimeproducts", (req, res) => {
    res.render("realtimeproducts", { style: "realtimeproducts" }); //Para renderizar contenido.
});

// RENDER CHAT
viewsRouter.get("/chat", (req, res) => {
    res.render("chat", { style: "chat" }); //Para renderizar contenido.
});

// RENDER LOCAL SIGNUP
viewsRouter.get("/api/sessions/signup", (req, res) => {
    res.render("localSignup", { style: "home" });
});

// RENDER LOCAL LOGIN
viewsRouter.get("/api/sessions/login", (req, res) => {
    res.render("localLogin", { style: "home" });
});

viewsRouter.get("/api/sessions/current", (req, res, next) => {
    passport.authenticate("authJWT", { session: false }, (err, user) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).send({ message: "Usuario no logueado 2." });
        }
        return res.send({ userInfo: user });
    })(req, res, next);
});

export default viewsRouter;