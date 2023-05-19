import productModel from "../models/productModel.js";

export class productManager {
    constructor() {
        console.log("Working with PRODUCTS using database in MongoDB.");
    }

    //GET PRODUCTS
    getProducts = async (limit, page, sort, category, status) => {

        let aggregateConfig = [];

        if (sort === "desc") {
            aggregateConfig.push({ $sort: { price: -1 } });
        } else if (sort === "asc") {
            aggregateConfig.push({ $sort: { price: 1 } });
        }

        if (category) {
            aggregateConfig.push({ $match: { category: category } });
        }

        if (status === "1") {
            aggregateConfig.push({ $match: { status: true } });
        } else if (status === "0") {
            aggregateConfig.push({ $match: { status: false } });
        }

        const aggregation = productModel.aggregate(aggregateConfig);
        const paginateConfig = {
            limit: limit ?? 10, //Cantidad de items a mostrar.
            lean: true, //Para compatbilidad con Handlebars.
            page: page ?? 1, //Página indicada por el Query, sino toma por default la página 1.
        };
        const result = await productModel.aggregatePaginate(aggregation, paginateConfig); //Inicia lectura general.

        return result;
    };

    //GET PRODUCT BY PID
    getProductById = async (productID) => {
        const result = await productModel.findOne({ _id: productID }).lean(); //Inicia lectura específica.
        return result;
    };

    //ADD PRODUCT
    addProduct = async (newProduct) => {
        const result = await productModel.create(newProduct);
        return result;
    };

    //UPDATE PRODUCT
    updateProduct = async (productID, updatedProduct) => {
        const result = await productModel.findOneAndUpdate(
            { _id: productID },
            updatedProduct,
            { new: true }
        ).lean();
        return result;
    };

    //DELETE PRODUCT BY PID
    deleteProduct = async (productID) => {
        const result = await productModel.deleteOne({ _id: productID });
        return result;
    };
}