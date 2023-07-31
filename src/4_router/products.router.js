import { Router } from "express";
import { productController } from "../3_controller/productController.js";
import { checkRole } from "../middlewares/auth.js";
import { generateMockingProduct } from "../utils.js";
import passport from "passport";

const productsRouter = Router();

//MOCKING 100 PRODUCTS
productsRouter.get("/mockingproducts", (req, res) => {
    let mockingProducts = [];
    for (let i = 0; i < 100; i++) {
        const mockingProduct = generateMockingProduct();
        mockingProducts.push(mockingProduct);
    }
    res.json({ status: "Success", payload: mockingProducts });
});

//LECTURA GENERAL PRODUCTOS
productsRouter.get("/", productController.getProducts);

//LECTURA PRODUCTO x PID
productsRouter.get("/:pid", productController.getProductById);

//AGREGAR PRODUCTO
productsRouter.post("/", passport.authenticate("authJWT", { session: false }), checkRole(["premium", "admin"]), productController.addProduct);

//MODIFICAR x PID
productsRouter.put("/:pid", checkRole(["premium, admin"]), productController.updateProduct);

//ELIMINAR x PID
productsRouter.delete("/:pid", passport.authenticate("authJWT", { session: false }), checkRole(["premium", "admin"]), productController.deleteProduct);

export default productsRouter;