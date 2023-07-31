import { Router } from "express";
import { cartController } from "../3_controller/cartController.js";
import { checkRole, checkAuthenticated } from "../middlewares/auth.js";
import { sendTicketEmail } from "../middlewares/mailing.js";

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
cartsRouter.put("/:cid/product/:pid", checkAuthenticated, cartController.updateCartUnitaryProduct);

//AGREGAR N PRODUCTOS EN CARRITO x CID
cartsRouter.put("/:cid", checkAuthenticated, cartController.updateCartUnitaryProduct);

//VACIAR x CID
cartsRouter.delete("/:cid", cartController.emptyCartById);

//COMPRAR CARRITO x CID (POR MEJORAR)
const cManager = new cartManager();
const pManager = new productManager();
const tManager = new ticketManager();
cartsRouter.post("/:cid/purchase", checkAuthenticated, async (req, res) => {
    try {
        const email = req.user.email;
        const cartId = req.params.cid;
        const cart = await cManager.getCartById(cartId);
        if (cart) {
            if (!cart.products.length) {
                return res.send("Es necesario que agrege productos antes de realizar la compra.")
            }
            const ticketProducts = [];
            const rejectedProducts = [];
            let total = 0;
            for (let i = 0; i < cart.products.length; i++) {
                const cartProduct = cart.products[i];
                const productDB = await pManager.getProductById(cartProduct.productCode);
                //Comparar la cantidad de ese producto en el carrito con el stock del producto.
                if (cartProduct.productQuantity <= productDB.stock) {
                    ticketProducts.push(cartProduct);
                    total = total + (cartProduct.productCode.price * cartProduct.productQuantity);
                } else {
                    rejectedProducts.push(cartProduct);
                }
            }
            const newTicket = {
                code: uuidv4(),
                purchase_datetime: new Date().toLocaleString(),
                amount: total,
                purchaser: email
            }
            const ticketCreated = await tManager.addTicket(newTicket);
            // console.log(rejectedProducts);
            // console.log(ticketProducts);
            // console.log(ticketCreated);
            const objTicket = { status: "success", products: ticketProducts, ticket: ticketCreated };
            await sendTicketEmail(email, objTicket); //Activa correo de ticket.
            res.send(objTicket);
        } else {
            res.send("El carrito no existe.")
        }
    } catch (error) {
        res.send(error.message)
    }
});

export default cartsRouter;