// GENERAL IMPORTS
import path from "path";
import express, { urlencoded } from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import mongoose from "mongoose";
import swaggerUi from "swagger-ui-express";
import { swaggerSpecs } from "./config/documentationConfig.js";
import { __filename, __dirname } from "./utils.js";
import { options } from "./config/options.js";
import productManager from "./1_persistence/file-managers/productManager.js";
import { chatManager } from "./1_persistence/db-managers/chatManager.js";
import productsRouter from "./4_router/products.router.js";
import cartsRouter from "./4_router/carts.router.js";
import viewsRouter from "./4_router/views.router.js";
import usersRouter from "./4_router/users.router.js";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/errorHandler.js";
import { addLogger } from "./middlewares/logger.js";

// SESSIONS & PASSPORT IMPORTS
import authRouter from "./4_router/auth.router.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import { initializePassport } from "./config/passportConfig.js";

// EXPRESS - MIDDLEWARES
const app = express();
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(express.static(__dirname + "/../public"));
app.use(cookieParser());
app.use(express.static("multer"));

// HTTP SERVER
const port = options.server.port;
const httpServer = app.listen(port, () => {
    console.log(`APP.JS | Server Listening - Port ${port}`);
});

// SOCKET SERVER
const chat = new chatManager();
const socketServer = new Server(httpServer);

socketServer.on("connection", async (socket) => {
    console.log("APP.JS | New Client Connected");

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
}, 1000); //Actualización cada 1 segundo.

// MONGOOSE
const database = options.database.url;
try {
    await mongoose.connect(database);
    console.log("APP.JS | Connected DB");
} catch (error) {
    console.log(`APP.JS | Connection Error: ${error}`);
}

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
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

// HANDLEBARS
app.engine("hbs", engine({
    helpers: {
        Equals: function (a, b, options) {
            return a === b ? options.fn(this) : options.inverse(this);
        },
        notEquals: function (a, b, options) {
            return a !== b ? options.fn(this) : options.inverse(this);
        }
    }
}));
app.set("view engine", "hbs");
// app.set("views", __dirname + "/views");
app.set('views', path.join(__dirname, "/views"));


// ROUTERS
app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/sessions', authRouter);
app.use('/api/users', usersRouter);
app.use(errorHandler);

// LOGGER TEST
app.use(addLogger);
app.get("/loggertest", (req, res) => {
    req.logger.debug("Nivel debug");
    req.logger.http("Nivel http");
    req.logger.info("Nivel info");
    req.logger.warning("Nivel warning");
    req.logger.error("Nivel error");
    req.logger.fatal("Nivel fatal");
    res.send("TEST NIVELES")
});

// DOCUMENTACIÓN
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));