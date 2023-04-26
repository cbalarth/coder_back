// GENERAL IMPORTS
import express, {urlencoded} from "express";
import {__filename, __dirname} from "./utils.js";
import {engine} from "express-handlebars";
import {Server} from "socket.io";
import mongoose from "mongoose";
import viewsRouter from "./routes/views.router.js";
import productManager from "./dao/file-managers/productManager.js";
import chatManager from "./dao/db-managers/chatManager.js";
import {database} from "./config/databaseConfig.js";

// SESSIONS & PASSPORT IMPORTS
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import {initializedPassport} from "./config/passportConfig.js";
import authRouter from "./routes/db-routers/auth.router.js";

// CONDITIONAL IMPORTS
import {persistenceConfig} from "./config/persistenceConfig.js" //Returns persistenceType ("db" or "file").
import DbProductsRouter from "./routes/db-routers/products.router.js";
import DbCartsRouter from "./routes/db-routers/carts.router.js";
import FileProductsRouter from "./routes/file-routers/products.router.js";
import FileCartsRouter from "./routes/file-routers/carts.router.js";
const productsRouter = persistenceConfig.persistenceType === "db" ? DbProductsRouter : FileProductsRouter;
const cartsRouter = persistenceConfig.persistenceType === "db" ? DbCartsRouter : FileCartsRouter;

// EXPRESS
const app = express();
app.use(express.json());
app.use(urlencoded({extended: true}));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/../public"));

// HTTP SERVER
const httpServer = app.listen(8080, () => {
    console.log("Server Listening - Port 8080");
});

// SOCKET SERVER
const chat = new chatManager();
const socketServer = new Server(httpServer);

socketServer.on("connection", async (socket) => {
    console.log("New Client Connected");

    let messages = await chat.getMessages();

    socket.on("eventFront", (data) => {
        console.log(data);
    });

    //REAL TIME CHAT
    socket.on("message", async (data) => {
        messages.push(data);
        socketServer.emit("messages", messages);

        await chat.saveMessage(data);
    });

    socket.on("newUser", (user) => {
        socket.emit("messages", messages);
        socket.broadcast.emit("newUser", user);
    });
});

// REAL TIME PRODUCTS UPDATE (Only for "file" model.).
const pManager = new productManager();
const products = await pManager.getProducts();
setInterval(() => {
    socketServer.emit("productsUpdated", products);
}, 1000);

// MONGOOSE
mongoose.connect(
    database
).then((conn) => {
    console.log("Connected to DB.");
});

// SESSIONS
app.use(session({
    store: MongoStore.create({
        mongoUrl: database,
    }),
    secret: "claveSecreta",
    resave: true,
    saveUninitialized: true
}));

// PASSPORT
initializedPassport();
app.use(passport.initialize());
app.use(passport.session());

// HANDLEBARS
app.engine("hbs", engine());
app.set("view engine", "hbs");
app.set("views", __dirname + "/views");

// ROUTERS
app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/sessions', authRouter);