import { productsDao } from "../1_persistence/factory.js";

export class productService {
    //GET PRODUCTS
    static getProducts = async (limit, page, sort, category, status) => {
        const products = await productsDao.getProducts(limit, page, sort, category, status);
        return products;
    };

    //GET PRODUCT BY PID
    static getProductById = async (productID) => {
        const product = await productsDao.getProductById(productID);
        return product;
    };

    //ADD PRODUCT
    static addProduct = async (newProduct) => {
        const product = await productsDao.addProduct(newProduct);
        return product;
    };

    //UPDATE PRODUCT
    static updateProduct = async (productID, updatedProduct) => {
        const product = await productsDao.updateProduct(productID, updatedProduct);
        return product;
    };

    //DELETE PRODUCT BY PID
    static deleteProduct = async (productID) => {
        const product = await productsDao.deleteProduct(productID);
        return product;
    };
};