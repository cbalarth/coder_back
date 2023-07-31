import nodemailer from "nodemailer";
import { options } from "../config/options.js";

//TRANSPORTER
const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
        user: options.gmail.emailAdmin,
        pass: options.gmail.emailPass
    },
    secure: false,
    tls: {
        rejectUnauthorized: false
    }
});

//GENERAR CORREO DE BIENVENIDA
const sendSignupEmail = async (userEmail, userName) => {
    //Enlace Productos
    const link = `http://localhost:8080/products`;
    //Estructura del Correo
    await transporter.sendMail({
        from: options.gmail.emailAdmin,
        to: userEmail,
        subject: "eCommerce Balart - Bienvenido",
        html: `
            <div>
                <h2>¡Hola ${userName}!</h2>
                <p>Bienvenido, tu cuenta ha sido creada exitosamente.</p>
                <p>Haz click en el siguiente enlace para iniciar la experiencia de compra.</p>
                <a href="${link}">
                    <button>Comprar</button>
                </a>
            </div>
        `
    })
};

//GENERAR CORREO DE RESTABLECIMIENTO
const sendRecoveryEmail = async (userEmail, token) => {
    //Enlace Token
    const link = `http://localhost:8080/reset-password?token=${token}`;
    //Estructura del Correo
    await transporter.sendMail({
        from: options.gmail.emailAdmin,
        to: userEmail,
        subject: "eCommerce Balart - Restablecer Contraseña",
        html: `
            <div>
                <h2>Olvidaste tu contraseña.</h2>
                <p>Haz click en el siguiente enlace para restablecer la contraseña.</p>
                <a href="${link}">
                    <button>Restablecer Contraseña</button>
                </a>
            </div>
        `
    })
};

//GENERAR CORREO DE ELIMINACIÓN DE CUENTA
const sendAccountDeletionEmail = async (userEmail) => {
    //Enlace Registro
    const link = `http://localhost:8080/signup`;
    //Estructura del Correo
    await transporter.sendMail({
        from: options.gmail.emailAdmin,
        to: userEmail,
        subject: "eCommerce Balart - Adiós",
        html: `
            <div>
                <h2>Tu cuenta ha sido eliminada por inactividad.</h2>
                <p>Haz click en el siguiente enlace para registrarte nuevamente.</p>
                <a href="${link}">
                    <button>Registrarse</button>
                </a>
            </div>
        `
    })
};

//GENERAR CORREO DE ELIMINACIÓN DE PRODUCTO
const sendProductDeletionEmail = async (userEmail, deletedProduct) => {
    //Enlace Productos
    const link = `http://localhost:8080/products`;
    //Estructura del Correo
    await transporter.sendMail({
        from: options.gmail.emailAdmin,
        to: userEmail,
        subject: "eCommerce Balart - Producto Eliminado",
        html: `
            <div>
                <h2>Tu producto ha sido eliminado.</h2>
                <p>ID: ${deletedProduct._id}</p>
                <p>Code: ${deletedProduct.code}</p>
                <p>Title: ${deletedProduct.title}</p>
                <p>Haz click en el siguiente enlace para iniciar la experiencia de compra.</p>
                <a href="${link}">
                    <button>Comprar</button>
                </a>
            </div>
        `
    })
};

//GENERAR CORREO DE COMPRA DE CARRITO
const sendTicketEmail = async (userEmail, objTicket) => {
    // Estructura del Correo
    await transporter.sendMail({
        from: options.gmail.emailAdmin,
        to: userEmail,
        subject: `eCommerce Balart - Compra Aprobada (${objTicket.ticket.code})`,
        html: `
            <div>
                <h1>Ticket de Compra</h1>
                <p><strong>Código del Ticket:</strong> ${objTicket.ticket.code}</p>
                <p><strong>Fecha de Compra:</strong> ${objTicket.ticket.purchase_datetime}</p>
                <p><strong>Total de Compra:</strong> $${objTicket.ticket.amount}</p>
                <p><strong>Comprador:</strong> ${objTicket.ticket.purchaser}</p>
                
                <h2>Productos:</h2>
                <ul>
                    ${objTicket.products.map(product => `
                        <li>
                            <strong>Título:</strong> ${product.productCode.title}<br>
                            <strong>Precio Unitario:</strong> $${product.productCode.price}<br>
                            <strong>Cantidad:</strong> ${product.productQuantity}
                        </li><br>
                    `).join('')}
                </ul>
            </div>
        `
    })
};

export { sendSignupEmail, sendRecoveryEmail, sendAccountDeletionEmail, sendProductDeletionEmail, sendTicketEmail };