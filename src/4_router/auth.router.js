import { Router } from "express";
import { createHash, isValidPassword } from "../utils.js";
import userModel from "../1_persistence/models/userModel.js";
import { userManager } from "../1_persistence/db-managers/userManager.js";
import { options } from "../config/options.js";
import jwt from "jsonwebtoken";

const authRouter = Router();
const uManager = new userManager(userModel);

// SIGNUP (API o RENDER)
authRouter.post("/signup", async (req, res) => {
    try {
        const { first_name, last_name, email, password } = req.body;
        const user = await uManager.getUserByEmail(email);
        if (!user) {
            let role = "user";
            if (email.endsWith("@coder.com")) {
                role = "admin";
            }
            const newUser = {
                first_name,
                last_name,
                email,
                password: createHash(password),
                role
            };
            const userCreated = await uManager.addUser(newUser);
            const token = jwt.sign({ _id: userCreated._id, first_name: userCreated.first_name, email: userCreated.email, role: userCreated.role }, options.server.secretToken, { expiresIn: "24h" });
            res.cookie(options.server.cookieToken, token, {
                httpOnly: true
            }).redirect("/products");
        } else {
            res.send(`<div>Usuario existente, <a href="/api/sessions/login">proceda al login.</a></div>`);
        }
    } catch (error) {
        res.json({ status: "error", message: error.message });
    }
});

// LOGIN (API o RENDER)
authRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await uManager.getUserByEmail(email);
        if (user) {
            //validar la contraseña
            if (isValidPassword(password, user)) {
                //generar el token
                const token = jwt.sign({ _id: user._id, first_name: user.first_name, email: user.email, role: user.role }, options.server.secretToken, { expiresIn: "24h" });
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

// FORGOT (API)
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

// LOGOUT (API o RENDER)
authRouter.get("/logout", (req, res) => {
    req.logout(() => {
        res.clearCookie(options.server.cookieToken).json({ status: "success", message: "LOGOUT: Session finalizada exitosamente." });
    });
});

export default authRouter;