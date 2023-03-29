import productModel from "../models/productModel.js";

export default class productManager {
    constructor() {
        console.log("Working with products using database.");
    }

    getProducts = async () => {
        const result = await productModel.find().lean();
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