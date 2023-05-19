import { Router } from "express";
import { cartController } from "../3_controller/cartController.js";

const cartsRouter = Router();

//LECTURA GENERAL CARRITOS
cartsRouter.get("/", cartController.getCarts);

//LECTURA CARRITO x CID
cartsRouter.get("/:cid", cartController.getCartById);

//AGREGAR CARRITO
cartsRouter.post("/", cartController.addCart);

//AGREGAR 1 PRODUCTO x PID EN CARRITO x CID
cartsRouter.put("/:cid/product/:pid", cartController.updateCartUnitaryProduct);

//AGREGAR N PRODUCTOS EN CARRITO x CID
cartsRouter.put("/:cid", cartController.updateCartUnitaryProduct);

// //VACIAR x CID
cartsRouter.delete("/:cid", cartController.emptyCartById);

export default cartsRouter;