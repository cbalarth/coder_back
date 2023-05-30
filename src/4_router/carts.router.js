import { Router } from "express";
import { cartController } from "../3_controller/cartController.js";
import { checkRole } from "../middlewares/checkRole.js";

import { productManager } from "../1_persistence/db-managers/productManager.js";
import { cartManager } from "../1_persistence/db-managers/cartManager.js";
import { ticketManager } from "../1_persistence/db-managers/ticketManager.js";
import { v4 as uuidv4 } from 'uuid';

const cartsRouter = Router();

//LECTURA GENERAL CARRITOS
cartsRouter.get("/", cartController.getCarts);

//LECTURA CARRITO x CID
cartsRouter.get("/:cid", cartController.getCartById);

//AGREGAR CARRITO
cartsRouter.post("/", cartController.addCart);

//AGREGAR 1 PRODUCTO x PID EN CARRITO x CID
cartsRouter.put("/:cid/product/:pid", checkRole(["user"]), cartController.updateCartUnitaryProduct);

//AGREGAR N PRODUCTOS EN CARRITO x CID
cartsRouter.put("/:cid", checkRole(["user"]), cartController.updateCartUnitaryProduct);

//VACIAR x CID
cartsRouter.delete("/:cid", cartController.emptyCartById);

//COMPRAR CARRITO x CID (POR MEJORARRR)
const cManager = new cartManager();
const pManager = new productManager();
const tManager = new ticketManager();
cartsRouter.post("/:cid/purchase", async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await cManager.getCartById(cartId);
        if (cart) {
            if (!cart.products.length) {
                return res.send("es necesario que agrege productos antes de realizar la compra")
            }
            const ticketProducts = [];
            const rejectedProducts = [];
            for (let i = 0; i < cart.products.length; i++) {
                const cartProduct = cart.products[i];
                const productDB = await pManager.getProductById(cartProduct.productCode);
                //comparar la cantidad de ese producto en el carrito con el stock del producto
                if (cartProduct.productQuantity <= productDB.stock) {
                    ticketProducts.push(cartProduct);
                } else {
                    rejectedProducts.push(cartProduct);
                }
            }
            console.log("ticketProducts", ticketProducts)
            console.log("rejectedProducts", rejectedProducts)
            const newTicket = {
                code: uuidv4(),
                purchase_datetime: new Date().toLocaleString(),
                amount: 50000,
                purchaser: "email test"
            }
            const ticketCreated = await tManager.addTicket(newTicket);
            res.send(ticketCreated)
        } else {
            res.send("el carrito no existe")
        }
    } catch (error) {
        res.send(error.message)
    }
});

export default cartsRouter;