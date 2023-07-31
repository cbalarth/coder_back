import { Router } from "express";
import { productManager } from "../1_persistence/db-managers/productManager.js";
import passport from "passport";
import { cartService } from "../2_service/cartService.js";
import { GetUserDto } from "../1_persistence/dto/user.dto.js";
import { checkRole, checkAuthenticated } from "../middlewares/auth.js";
import userModel from "../1_persistence/models/userModel.js";

const viewsRouter = Router();
const pManager = new productManager();

// RENDER HOME
viewsRouter.get("/", async (req, res) => {
    res.render("home", { style: "home" }); //Para renderizar contenido.
});

// RENDER PRODUCTOS
viewsRouter.get("/products", checkAuthenticated, async (req, res) => {
    const user = (await userModel.findOne({ email: req.user.email })).toJSON();
    const { limit, page, sort, category, status } = req.query; //Lectura general de productos.
    const products = await pManager.getProducts(limit, page, sort, category, status);
    return res.render("products", { user, products, limit: (limit ? limit : 10), sort, category, status, style: "general" }); //Para renderizar contenido.
});

// RENDER PRODUCTO X PID
viewsRouter.get("/products/:pid", checkAuthenticated, async (req, res) => {
    const user = (await userModel.findOne({ email: req.user.email })).toJSON();
    const { pid } = req.params;
    const product = await pManager.getProductById(pid); //Lectura de producto específico.
    res.render("product", { user, product, style: "general" }); //Para renderizar contenido.
});

// RENDER CARRITOS
viewsRouter.get("/carts", checkAuthenticated, async (req, res) => {
    const user = (await userModel.findOne({ email: req.user.email })).toJSON();
    const carts = await cartService.getCarts(req, res);
    res.render("carts", { user, carts, style: "general" });
});

// RENDER CARRITO x CID
viewsRouter.get("/carts/:cid", checkAuthenticated, async (req, res) => {
    const user = (await userModel.findOne({ email: req.user.email })).toJSON();
    const { cid } = req.params;
    let purchasable = false;
    if (cid == user.cart._id) {
        purchasable = true;
    }
    let cartProducts = (await cartService.getCartById(cid)).products; //Lectura general de productos de carrito específico.
    res.render("cart", { user, cid, cartProducts, purchasable, style: "general" }); //Para renderizar contenido.
});

// RENDER CARRITO PERSONAL
viewsRouter.get("/myCart", checkAuthenticated, async (req, res) => {
    const user = (await userModel.findOne({ email: req.user.email })).toJSON();
    const cid = user.cart._id;
    const cartProducts = (await cartService.getCartById(cid)).products; //Lectura general de productos de carrito específico.
    const purchasable = true;
    res.render("cart", { user, cid, cartProducts, purchasable, style: "general" }); //Para renderizar contenido.
});

// RENDER CHAT
viewsRouter.get("/chat", checkRole(["user"]), (req, res) => {
    const user = req.user;
    res.render("chat", { user, style: "chat" }); //Para renderizar contenido.
});

// RENDER PRODUCTOS EN VIVO
viewsRouter.get("/realtimeproducts", (req, res) => {
    res.render("realtimeproducts", { style: "realtimeproducts" }); //Para renderizar contenido.
});

// RENDER LOCAL SIGNUP
viewsRouter.get("/signup", (req, res) => {
    res.render("localSignup", { style: "home" });
});

// RENDER LOCAL LOGIN
viewsRouter.get("/login", (req, res) => {
    res.render("localLogin", { style: "home" });
});

// RENDER FORGOT PASSWORD
viewsRouter.get("/forgot-password", (req, res) => {
    res.render("localLoginForgot", { style: "home" });
});

// RENDER RESET PASSWORD
viewsRouter.get("/reset-password", (req, res) => {
    const token = req.query.token;
    res.render("localLoginReset", { token, style: "home" });
});

// ESTADO DE AUTENTICACIÓN
viewsRouter.get("/current", (req, res, next) => {
    passport.authenticate("authJWT", { session: false }, (err, user) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).send({ message: "Usuario no logueado (views.router.js / current)." });
        }
        const result = new GetUserDto(user);
        res.send({ userInfo: result });
    })(req, res, next);
});

// RENDER USERS
viewsRouter.get("/users", checkRole(["admin"]), async (req, res) => {
    const users = await userModel.find().lean();
    res.render("users", { users, style: "general" });
});

export default viewsRouter;