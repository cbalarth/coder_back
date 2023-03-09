import fs from "fs";

class cartManager {
    #path = "./carts.json";

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

    async addCart(cid, products) {
        const newCart = {
            cid,
            products,
    };

    const carts = await this.getCarts();
    const updatedcarts = [...carts, newCart];
    await fs.promises.writeFile(this.#path, JSON.stringify(updatedcarts)); //Crear archivo JSON con string del objeto.
    }

    async updateCart(cartID, productID, data) {
        const carts = await this.getCarts();
        const cartIndexToBeUpdated = carts.findIndex((c) => c.cid == cartID);
        const productIndexToBeUpdated = carts[cartIndexToBeUpdated].products.findIndex((p) => p.productCode == productID);
        try {
            if(productIndexToBeUpdated<0){ //Si aún no hay unidades de ese producto en ese carrito.
                carts[cartIndexToBeUpdated].products.push({ //Agrega el producto con su cantidad.
                    productCode: Number(productID),
                    ...data,
                })
            } else { //Si ya hay unidades de ese producto en ese carrito.
                carts[cartIndexToBeUpdated].products[productIndexToBeUpdated] = {
                    ...carts[cartIndexToBeUpdated].products[productIndexToBeUpdated],
                    productQuantity: carts[cartIndexToBeUpdated].products[productIndexToBeUpdated].productQuantity + data.productQuantity, //Aumenta la cantidad del producto.
                }
            }
            await fs.promises.writeFile(this.#path, JSON.stringify(carts)); //Crear archivo JSON con string del objeto.
            return carts[cartIndexToBeUpdated];
        } catch (e) {
            return console.log((`ERROR: ¡No existe el carrito con ID ${cartID}!`));
        }
    }
}

export default cartManager;