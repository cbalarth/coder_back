import { Router } from "express";
import { createHash, isValidPassword } from "../utils.js";
import { uploaderUserAvatar } from "../utils.js";
import { sendRecoveryEmail, sendSignupEmail } from "../middlewares/mailing.js";
import { generateEmailToken, verifyEmailToken } from "../utils.js";
import userModel from "../1_persistence/models/userModel.js";
import { userManager } from "../1_persistence/db-managers/userManager.js";
import { options } from "../config/options.js";
import jwt from "jsonwebtoken";
import { EnumError } from "../constants/index.js";
import { CustomError } from "../services/customError.service.js";
import { generateUserErrorInfo } from "../services/userErrorInfo.js";
import { cartService } from "../2_service/cartService.js";

const authRouter = Router();
const uManager = new userManager(userModel);

// SIGNUP
authRouter.post("/signup", uploaderUserAvatar.single("avatar"), async (req, res) => {
    try {
        const { first_name, last_name, email, password } = req.body;
        const user = await uManager.getUserByEmail(email);

        //Validación password con al menos 1 número.
        const regex = /\d/;
        const doesItHaveNumber = regex.test(password);
        if (!doesItHaveNumber) {
            console.log(generateUserErrorInfo(req.body));
            CustomError.createError({
                name: "Password without number.",
                cause: generateUserErrorInfo(req.body),
                message: "Error creando el nuevo usuario.",
                errorCode: EnumError.AUTH_ERROR
            });
        }

        //Valida que usuario no existe y lo crea.
        if (!user) {
            let role;
            if (email.endsWith("@coder.com")) { //Cambia rol a "Admin" si es de Coder.
                role = "admin";
            }
            const newCart = await cartService.addCart({}); //Crea nuevo carrito.
            const newUser = {
                first_name,
                last_name,
                email,
                password: createHash(password),
                role,
                avatar: req.file.path, //Ruta de la imagen.
                last_connection: new Date(),
                cart: newCart._id
            };
            const userCreated = await uManager.addUser(newUser);
            await sendSignupEmail(email, first_name); //Activa correo de bienvenida.
            const token = jwt.sign({ _id: userCreated._id, first_name: userCreated.first_name, email: userCreated.email, role: userCreated.role }, options.server.secretToken, { expiresIn: "24h" });
            res.cookie(options.server.cookieToken, token, {
                httpOnly: true
            }).redirect("/products"); //Redirige a vista de productos.
        } else {
            res.send(`<div>Usuario existente. <a href="/login">LOGIN</a></div>`);
        }
    } catch (error) {
        res.json({ status: "error", message: error.message });
    }
});

// LOGIN
authRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await uManager.getUserByEmail(email);
        if (user) {
            //Validar la contraseña.
            if (isValidPassword(password, user)) {
                //Actualizar last_connection.
                user.last_connection = new Date();
                await userModel.findByIdAndUpdate(user._id, user);
                //Generar el token.
                const token = jwt.sign({ _id: user._id, first_name: user.first_name, last_name: user.last_name, email: user.email, role: user.role }, options.server.secretToken, { expiresIn: "24h" });
                res.cookie(options.server.cookieToken, token, {
                    httpOnly: true
                }).redirect("/products")
            } else {
                res.send(`<div>Credenciales no válidas, <a href="/api/sessions/login">intente nuevamente.</a></div>`);
            }
        } else {
            res.send(`<div>Usuario no existente, <a href="/api/sessions/signup">proceda al registro.</a></div>`);
        }
    } catch (error) {
        res.json({ status: "error", message: error.message });
    }
})

// FORGOT PASSWORD V1 (Only API)
authRouter.post("/forgot", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email: email });
        if (user) {
            user.password = createHash(password);
            const userUpdate = await userModel.findOneAndUpdate({ email: user.email }, user, { new: true });
            res.send("Contraseña actualizada exitosamente.");
        } else {
            req.send("El usuario no está registrado.")
        }
    } catch (error) {
        res.send("No se pudo restaurar la contraseña.")
    }
});

// FORGOT PASSWORD V2
authRouter.post("/forgot-password", async (req, res) => {
    try {
        const { email } = req.body;
        const user = await userModel.findOne({ email: email });
        //Si el usuario no existe.
        if (!user) {
            return res.send(`<div>ERROR 01 <a href="/forgot-password">Click aquí para intentar nuevamente...</a></div>`);
        }
        //Si el usuario existe, generamos el token del enlace.
        const token = generateEmailToken(email, 3600 * 1); //Duración en segundos (3600s = 1h)
        await sendRecoveryEmail(email, token); //Activa correo de restablecimiento.
        res.send("Enlace de restablecimiento enviado exitosamente a su correo. <a href='/login'>LOGIN</a>");
    } catch (error) {
        res.send(`<div>ERROR 02 <a href="/forgot-password">Click aquí para intentar nuevamente...</a></div>`);
    }
});

// RESET PASSWORD
authRouter.post("/reset-password", async (req, res) => {
    try {
        const token = req.query.token;
        const { email, newPassword } = req.body;
        const user = await userModel.findOne({ email: email });
        const validEmail = verifyEmailToken(token);
        //Si el usuario no existe.
        if (!user) {
            return res.send("El usuario no está registrado.")
        }
        //Si el token no es válido.
        if (!validEmail) {
            return res.send(`El enlace ya no es válido. <a href="/forgot-password">Click aquí para intentar nuevamente...</a>`)
        }
        //Si intenta mantener la contraseña actual.
        if (isValidPassword(newPassword, user)) {
            return res.send("No puedes usar la misma contraseña.");
        }
        const userData = {
            ...user._doc,
            password: createHash(newPassword)
        }
        const userUpdate = await userModel.findOneAndUpdate({ email: email }, userData);
        res.render("localLogin", { resetMessage: "Contraseña actualizada exitosamente.", style: "home" });
    } catch (error) {
        res.send(error.message);
    }
});

// LOGOUT
authRouter.get("/logout", (req, res) => {
    req.logout(() => {
        res.clearCookie(options.server.cookieToken).json({ status: "success", message: "Sesión finalizada exitosamente." });
    });
});

export default authRouter;