import { Router } from "express";
import { productController } from "../3_controller/productController.js";
import { checkRole } from "../middlewares/checkRole.js";

const productsRouter = Router();

//LECTURA GENERAL PRODUCTOS
productsRouter.get("/", productController.getProducts);

//LECTURA PRODUCTO x PID
productsRouter.get("/:pid", productController.getProductById);

//AGREGAR PRODUCTO
productsRouter.post("/", checkRole(["admin"]), productController.addProduct);

//MODIFICAR x PID
productsRouter.put("/:pid", checkRole(["admin"]), productController.updateProduct);

//ELIMINAR x PID
productsRouter.delete("/:pid", checkRole(["admin"]), productController.deleteProduct);

export default productsRouter;