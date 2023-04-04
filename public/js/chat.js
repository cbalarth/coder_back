let user;
const socket = io();

Swal.fire({
    title: 'Identificación',
    input: "email", // Se indica el tipo de input como "email".
    text: 'Ingresa tu correo electrónico.',
    inputValidator: (value) => {
        // Se utiliza una expresión regular para validar el formato del correo.
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            return "¡Es obligatorio introducir un correo electrónico!";
        }
    },
    allowOutsideClick: false,
    confirmButtonText: 'Enviar'
}).then((result) => {
    user = result.value;
    socket.emit("newUser", user);
});

// IDENTIFICA "INPUT MENSAJE" Y LO GUARDA EN "ARRAY MENSAJE"
const chatInput = document.getElementById("chatInput");
chatInput.addEventListener("keyup", (ev) => {
    if (ev.key === "Enter"){
        const messageInput = chatInput.value;
        if (messageInput.trim().length > 0){
            socket.emit("message", {user, message: messageInput});
            chatInput.value = "";
        }
    }
}); 

// PROPORCIONA DATOS AL HTML EN BASE AL "OBJETO MENSAJES"
const chatMessages = document.getElementById("chatMessagesList");
socket.on("messages", (data) => {
    chatMessages.innerHTML = "";
    for (const { user, message } of data) {
        const li = document.createElement("li");
        li.innerHTML = `<b>${user}</b> - ${message}`;
        chatMessages.prepend(li);
    }
});

// AVISA ENTRADA DE NUEVO USUARIO A TODOS LOS USUARIOS YA CONECTADOS
socket.on("newUser", (user) => {
    Swal.fire({
        title: `El usuario ${user} se ha unido al chat.`,
        toast: true,
        position: "top-end"
    });
});