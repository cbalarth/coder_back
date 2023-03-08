import fs from "fs";

class cartManager {
    #path = "./carts.json";
    carts = [];

    async addCart(cid, products) {
        const newCart = {
            cid,
            products,
    };

    const carts = await this.getCarts();
    const updatedcarts = [...carts, newCart];
    await fs.promises.writeFile(this.#path, JSON.stringify(updatedcarts)); //Crear archivo JSON con string del objeto base.
    }

    async getCarts() {
        try {
            const carts = await fs.promises.readFile(this.#path, "utf-8");
            return JSON.parse(carts); //Retorna objeto del string almacenado en el JSON.
        } catch (e) {
            return [];
        }
    }

    async getCartById(cartID) {
        const carts = await this.getCarts();
        try {
            const carritoEncontrado = carts.find((c) => c.cid == cartID);
            return carritoEncontrado;
        } catch (e) {
            return console.log((`ERROR: ¡No existe el carrito con ID ${cartID}!`));
        }
    }

    async updateCart(cartID, productID, data) {
        const carts = await this.getCarts();
        const cartIndexToBeUpdated = carts.findIndex((c) => c.cid == cartID);
        console.log(cartIndexToBeUpdated);
        const productIndexToBeUpdated = carts[cartIndexToBeUpdated].products.findIndex((p) => p.productCode == productID);
        console.log(productIndexToBeUpdated);
        try {
            if(productIndexToBeUpdated<0){
                carts[cartIndexToBeUpdated].products.push({
                    productCode: Number(productID),
                    ...data,
                })
            } else {
                carts[cartIndexToBeUpdated].products[productIndexToBeUpdated] = {
                    ...carts[cartIndexToBeUpdated].products[productIndexToBeUpdated],
                    productQuantity: carts[cartIndexToBeUpdated].products[productIndexToBeUpdated].productQuantity + data.productQuantity,
                }
            }

            await fs.promises.writeFile(this.#path, JSON.stringify(carts));
            return carts[cartIndexToBeUpdated];
        } catch (e) {
            return console.log((`ERROR: ¡No existe el carto con ID ${cartID}!`));
        }
    }
}

//     if(!product){ //Si el producto no está en el carrito lo agrega.
//         const newProduct = {
//             productCode: productID,
//             ...req.body
//         }
//         cart.products = [...cart.products, newProduct];
//     } else { //Si el producto ya está en el carrito suma la cantidad.
//         product.productQuantity = product.productQuantity + req.body.productQuantity;
//     }

export default cartManager;