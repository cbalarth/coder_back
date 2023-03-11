console.log("HELLO FROM INDEX.JS")
const socket = io();

socket.emit("eventFront", "Mensaje desde el FrontEnd.");