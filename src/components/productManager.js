import fs from "fs";

class productManager {
    #path = "./products.json";
    products = [];

    async addProduct(pid, title, description, code, price, status, stock, category, thumbnails) {
        const newProduct = {
            pid,
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnails,
    };

    const products = await this.getProducts();
    const updatedProducts = [...products, newProduct];
    await fs.promises.writeFile(this.#path, JSON.stringify(updatedProducts)); //Crear archivo JSON con string del objeto base.
    }

    async getProducts() {
        try {
            const products = await fs.promises.readFile(this.#path, "utf-8");
            return JSON.parse(products); //Retorna objeto del string almacenado en el JSON.
        } catch (e) {
            return [];
        }
    }

    async getProductById(productID) {
        const products = await this.getProducts();
        try {
            const productoEncontrado = products.find((p) => p.pid == productID);
            return productoEncontrado;
        } catch (e) {
            return console.log((`ERROR: ¡No existe el producto con ID ${productID}!`));
        }
    }

    async updateProduct(productID, data) {
        const products = await this.getProducts();
        const indexToBeUpdated = products.findIndex((p) => p.pid == productID);
        try {
            products[indexToBeUpdated] = {
                ...products[indexToBeUpdated],
                ...data,
            }
            await fs.promises.writeFile(this.#path, JSON.stringify(products));
            return products[indexToBeUpdated];
        } catch (e) {
            return console.log((`ERROR: ¡No existe el producto con ID ${productID}!`));
        }
    }

    async deleteProduct(productID) {
        const products = await this.getProducts();
        try {
            const updatedProducts = products.filter((p) => {
                return p.pid !== productID
            });
            await fs.promises.writeFile(this.#path, JSON.stringify(updatedProducts)); //Crear archivo JSON con string del objeto base.
            return updatedProducts;
        } catch (e) {
            return console.log((`ERROR: ¡No existe el producto con ID ${productID}!`));
        }
    }
}

export default productManager;