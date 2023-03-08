import express from "express";
import __dirname from "./utils.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";

const app = express();
app.use(express.json()); //Para qué sirve esto?
// app.use(express.urlencoded()); //Para qué sirve esto?

async function main() {

    app.use(express.static(__dirname + "/../public"));

    app.use('/api/products', productsRouter);
    app.use('/api/carts', cartsRouter);

    app.listen(8080, () => {
        console.log("Server Listening - Port 8080");
    });

}

main();