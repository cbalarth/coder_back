import cartManager from "./dao/db-managers/cartManager.js";

const cManager = new cartManager();
const agregarProductoCarrito = document.getElementById('action2');

agregarProductoCarrito.addEventListener('click', async () => {
    const newCart = await cManager.addCart({
        products: [],
    });
    console.log("Carrito Agregado:", newCart);
});