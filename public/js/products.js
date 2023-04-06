console.log("HELLO FROM PRODUCTS.JS IN PUBLIC DIRECTORY");
const socket = io();

socket.emit("eventFront", "Mensaje desde el FrontEnd.");
