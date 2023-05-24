import { Router } from "express";
import { productManager } from "../1_persistence/db-managers/productManager.js";
import { cartManager } from "../1_persistence/db-managers/cartManager.js";
import passport from "passport";
import { cartService } from "../2_service/cartService.js";
import { GetUserDto } from "../1_persistence/dto/user.dto.js";
import { checkRole } from "../middlewares/checkRole.js";

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
            return res.status(401).send({ message: "Usuario no logueado (internal code: 1)" });
        }
        const { limit, page, sort, category, status } = req.query;
        const products = await pManager.getProducts(limit, page, sort, category, status);
        const isAdmin = (user.role == "admin");
        return res.render("products", { products, limit: (limit ? limit : 10), sort, category, status, user, isAdmin, style: "products" });
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
    const carts = await cartService.getCarts(req, res);
    res.send(carts);
});

// RENDER CARRITO x CID
viewsRouter.get("/carts/:cid", async (req, res) => {
    const { cid } = req.params;
    let cartProducts = (await cartService.getCartById(cid)).products; //Lectura general de productos de carrito específico.
    res.render("cart", { cid, cartProducts, style: "products" }); //Para renderizar contenido.
});

// RENDER PRODUCTOS EN VIVO
viewsRouter.get("/realtimeproducts", (req, res) => {
    res.render("realtimeproducts", { style: "realtimeproducts" }); //Para renderizar contenido.
});

// RENDER CHAT
viewsRouter.get("/chat", checkRole(["user"]), (req, res) => {
    res.render("chat", { style: "chat" }); //Para renderizar contenido.
});

// RENDER LOCAL SIGNUP
viewsRouter.get("/signup", (req, res) => {
    res.render("localSignup", { style: "home" });
});

// RENDER LOCAL LOGIN
viewsRouter.get("/login", (req, res) => {
    res.render("localLogin", { style: "home" });
});

viewsRouter.get("/current", (req, res, next) => {
    passport.authenticate("authJWT", { session: false }, (err, user) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).send({ message: "Usuario no logueado (internal code: 2)." });
        }
        const result = new GetUserDto(user);
        return res.send({ userInfo: result });
    })(req, res, next);
});

export default viewsRouter;