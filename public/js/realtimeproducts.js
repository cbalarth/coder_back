console.log("HELLO FROM REALTIMEPRODUCTS.JS")
const socket = io();

const productsList = document.getElementById("productsList");
socket.on("productsUpdated", (data) => {
    console.log("¡Received products!");
    productsList.innerHTML = "";

    for (const p of data) {
        const div = document.createElement("div");
        div.classList.add("product");
        div.innerHTML = `
        <h2><strong>${p.title}</strong></h2>
        <li>Product ID: ${p.pid}</li>
        <li>Code: ${p.code}</li>
        <li>Price: $${p.price}</li>
        <li>Stock: ${p.stock}</li>
        <li>Category: ${p.category}</li>
        `;
        productsList.appendChild(div);
    }
});