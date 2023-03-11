import {__filename, __dirname} from "./utils.js";
import express, {urlencoded} from "express";
import {engine} from "express-handlebars";
import {Server} from "socket.io";
import viewsRouter from "./routes/views.router.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import productManager from "./components/productManager.js";

const app = express();
app.use(express.json());
app.use(urlencoded({extended: true}));
app.use(express.static(__dirname + "/../public"));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

app.use('/', viewsRouter);
app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// DECLARA HTTP SERVER
const httpServer = app.listen(8080, () => {
    console.log("Server Listening - Port 8080");
});

// INICIA SOCKET SERVER
const socketServer = new Server(httpServer);
socketServer.on("connection", (socket) => {
    console.log("New Client Connected");

    socket.on("eventFront", (data) => {
        console.log(data);
    });
});

// ACTUALIZACIÓN EN VIVO DE PRODUCTOS
const manager = new productManager();
const products = await manager.getProducts();
setInterval(() => {
    socketServer.emit("productsUpdated", products);
}, 1000);