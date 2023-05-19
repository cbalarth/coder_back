import { Router } from "express";
import { productController } from "../3_controller/productController.js";

const productsRouter = Router();

//LECTURA GENERAL PRODUCTOS
productsRouter.get("/", productController.getProducts);

//LECTURA PRODUCTO x PID
productsRouter.get("/:pid", productController.getProductById);

//AGREGAR PRODUCTO
productsRouter.post("/", productController.addProduct);

//MODIFICAR x PID
productsRouter.put("/:pid", productController.updateProduct);

//ELIMINAR x PID
productsRouter.delete("/:pid", productController.deleteProduct);

export default productsRouter;