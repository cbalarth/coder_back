import { productService } from "../2_service/productService.js";

export class productController {
    //GET PRODUCTS
    static getProducts = async (req, res) => {
        try {
            const { limit, page, sort, category, status } = req.query;
            const products = await productService.getProducts(limit, page, sort, category, status); //Inicia lectura general.

            res.status(201).send({
                status: "Success",
                payload: products.docs,
                totalPages: products.totalPages,
                prevPage: products.prevPage,
                nextPage: products.nextPage,
                hasPrevPage: products.hasPrevPage,
                hasNextPage: products.hasNextPage,
                prevLink: products.hasPrevPage ? `http://localhost:8080/api/products?` + (limit ? `limit=${limit}&` : "") + (sort ? `sort=${sort}&` : "") + `page=${products.prevPage}` : null,
                nextLink: products.hasNextPage ? `http://localhost:8080/api/products?` + (limit ? `limit=${limit}&` : "") + (sort ? `sort=${sort}&` : "") + `page=${products.nextPage}` : null,
            });
        } catch (err) {
            res.status(401).send({ status: "Failure", error: err.message });
        }
    };

    //GET PRODUCT BY PID
    static getProductById = async (req, res) => {
        try {
            const product = await productService.getProductById(req.params.pid); //Inicia lectura específica.
            res.status(201).send({ status: "Success", payload: product });
        } catch (err) {
            res.status(401).send({ status: "Failure", error: err.message });
        }
    }

    //ADD PRODUCT
    static addProduct = async (req, res) => {
        try {
            const newProduct = await productService.addProduct(req.body);
            res.status(201).send({ status: "Success", payload: newProduct });
        } catch (err) {
            res.status(401).send({ status: "Failure", error: err.message });
        }
    }

    //UPDATE PRODUCT
    static updateProduct = async (req, res) => {
        try {
            const updatedProduct = await productService.updateProduct(req.params.pid, req.body);
            res.status(201).send({ status: "Success", payload: updatedProduct });
        } catch (err) {
            res.status(401).send({ status: "Failure", error: err.message });
        }
    }

    //DELETE PRODUCT BY PID
    static deleteProduct = async (req, res) => {
        try {
            const deletion = await productService.deleteProduct(req.params.pid);
            res.status(201).send({ status: "Success", payload: deletion });
        } catch (err) {
            res.status(401).send({ status: "Failure", error: err.message });
        }
    }
};