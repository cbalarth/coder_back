import express from "express";
import __dirname from "./utils.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";

const app = express();

app.use(express.static(__dirname + "/../public"));

app.use('/api/products', productsRouter);
app.use('/api/products/:id', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/carts/:id', cartsRouter);

app.listen(8080, () => {
    console.log("Server Listening - Port 8080");
});