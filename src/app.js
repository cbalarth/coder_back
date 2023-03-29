//GENERAL IMPORTS
import express, {urlencoded} from "express";
import {__filename, __dirname} from "./utils.js";
import {engine} from "express-handlebars";
import {Server} from "socket.io";
import mongoose from "mongoose";
import viewsRouter from "./routes/views.router.js";
import productManager from "./dao/file-managers/productManager.js";

//CONDITIONAL IMPORTS
import {config} from "./dao/index.js" //Returns persistenceType ("db" or "file").
import DbProductsRouter from "./routes/db-routers/products.router.js";
import DbCartsRouter from "./routes/db-routers/carts.router.js";
import FileProductsRouter from "./routes/file-routers/products.router.js";
import FileCartsRouter from "./routes/file-routers/carts.router.js";
let productsRouter, cartsRouter;
if (config.persistenceType === "db"){
    productsRouter = DbProductsRouter;
    cartsRouter = DbCartsRouter;
} else if (config.persistenceType === "file") {
    productsRouter = FileProductsRouter;
    cartsRouter = FileCartsRouter;
}

// EXPRESS
const app = express();
app.use(express.json());
app.use(urlencoded({extended: true}));
app.use(express.static(__dirname + "/../public"));

// HANDLEBARS
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

// ROUTERS
app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// HTTP SERVER
const httpServer = app.listen(8080, () => {
    console.log("Server Listening - Port 8080");
});

// SOCKET SERVER
const socketServer = new Server(httpServer);
socketServer.on("connection", (socket) => {
    console.log("New Client Connected");

    socket.on("eventFront", (data) => {
        console.log(data);
    });
});

// REAL TIME PRODUCTS UPDATE (Only for "file").
const manager = new productManager();
const products = await manager.getProducts();
setInterval(() => {
    socketServer.emit("productsUpdated", products);
}, 1000);

// MONGOOSE
mongoose.connect(
    "mongodb+srv://cbalart96:mongocoder123@codercluster.jhyle2f.mongodb.net/ecommerce?retryWrites=true&w=majority"
).then((conn) => {
    console.log("Connected to DB.");
});