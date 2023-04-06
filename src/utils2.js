import {cartManager} from "./dao/index.js";
const manager = new cartManager();

const agregarProductoCarrito = document.getElementById('action2');

agregarProductoCarrito.addEventListener('click', async () => {
    const newCart = await manager.addCart({
        products: [],
    });
    console.log("Carrito agregado:", newCart);
});