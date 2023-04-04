import productModel from "../models/productModel.js";

export default class productManager {
    constructor() {
        console.log("Working with products using database.");
    }

    getProducts = async (limit, page, sort) => {

        let aggregateConfig;
        if(sort === "desc") {
        aggregateConfig = [
                {$sort: {price: -1}},
            ];
        } else if (sort === "asc") {
            aggregateConfig = [
                {$sort: {price: 1}},
            ];
        }

        const aggregation = productModel.aggregate(aggregateConfig);
        const paginateConfig = {
            limit: limit ?? 10, //Cantidad de items a mostrar.
            lean: true, //Para compatbilidad con Handlebars.
            page: page ?? 1, //Página indicada por el Query, sino toma por default la página 1.
        };
        const result = await productModel.aggregatePaginate(aggregation, paginateConfig);

        return result;
    };

    addProduct = async (newProduct) => {
        const result = await productModel.create(newProduct);
        return result;
    };

    getProductById = async (productID) => {
        const result = await productModel.findOne({_id: productID}).lean();
        return result;
    };
    
    updateProduct = async (productID, updatedProduct) => {
        const result = await productModel.findOneAndUpdate(
            {_id: productID},
            updatedProduct,
            {new: true}
            ).lean();
        return result;
    };
    

    deleteProduct = async (productID, updatedProduct) => {
        const result = await productModel.deleteOne({_id: productID});
        return result;
    };
}