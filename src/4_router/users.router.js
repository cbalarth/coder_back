import { Router } from "express";
import userModel from "../1_persistence/models/userModel.js";
import { checkRole, checkAuthenticated } from "../middlewares/auth.js";
import { sendAccountDeletionEmail } from "../middlewares/mailing.js";
import { uploaderUserDocuments } from "../utils.js"
import { GetUserDto } from "../1_persistence/dto/user.dto.js";

const usersRouter = Router();

//INTERCAMBIAR ROL DE UN USUARIO ESPECÍFICO ENTRE "USER" Y "PREMIUM". SOLO LO PUEDEN HACER LOS ADMIN
usersRouter.put("/premium/:uid", checkRole(["admin"]), async (req, res) => {
    try {
        const userId = req.params.uid;

        //Verificar si el usuario existe en la base de datos.
        const user = await userModel.findById(userId);
        const userRole = user.role;

        if (userRole === "user") {
            //Validar si el usuario con rol "user" tiene los 3 documentos.
            if (user.documents.length < 3 && user.status !== "completo") {
                return res.json({ status: "error", message: "No es posible cambiar el rol del usuario v1." });
            }
            user.role = "premium"
        } else if (userRole === "premium") {
            user.role = "user"
        } else {
            return res.json({ status: "error", message: "No es posible cambiar el rol del usuario v2." });
        }
        await userModel.updateOne({ _id: user._id }, user);
        res.send({ status: "success", message: "Rol modificado exitosamente." });
    } catch (error) {
        res.json({ status: "error", message: "No es posible cambiar el rol del usuario v3." })
    }
});

//SUBIR DOCUMENTOS DE VERIFICACIÓN.
usersRouter.put("/:uid/documents", checkAuthenticated, uploaderUserDocuments.fields([{ name: "identificacion", maxCount: 1 }, { name: "domicilio", maxCount: 1 }, { name: "estadoDeCuenta", maxCount: 1 }]), async (req, res) => {
    try {
        const user = req.user;
        const FoundUser = await userModel.findById(req.params.uid);
        if (FoundUser && FoundUser.email === user.email) {
            const docs = [...(FoundUser.documents || [])];
            const docTypes = { "identificacion": req.files['identificacion'], "domicilio": req.files['domicilio'], "estadoDeCuenta": req.files['estadoDeCuenta'] };
            // Agregar o reemplazar objetos en el array.
            const addOrUpdateDocument = (name) => {
                const newDoc = docTypes[name]?.[0];
                if (newDoc) {
                    const existingDocIndex = docs.findIndex(doc => doc.name === name);
                    if (existingDocIndex !== -1) { //Si el documento ya existe, se reemplaza el objeto.
                        docs[existingDocIndex].reference = newDoc.path;
                    } else { //Si no existe el documento, se agrega el objeto.
                        docs.push({ name: name, reference: newDoc.path });
                    }
                }
            };
            addOrUpdateDocument("identificacion");
            addOrUpdateDocument("domicilio");
            addOrUpdateDocument("estadoDeCuenta");
            // Actualizar estado del usuario.
            FoundUser.status = docs.length === 3 ? "completo" : "incompleto";
            FoundUser.documents = docs;
            await userModel.findByIdAndUpdate(FoundUser._id, FoundUser);
            res.json({ status: "success", message: "Documentos actualizados." });
        } else {
            res.json({ status: "error", message: "No es posible cargar los documentos v1." });
        }
    } catch (error) {
        res.json({ status: "error", message: "No es posible cargar los documentos v2." });
    }
});

//GET USERS
usersRouter.get("/", checkRole(["admin"]), async (req, res) => {
    try {
        const users = await userModel.find().lean();
        const result = users.map(user => new GetUserDto(user));
        res.send({ status: "success", payload: result });
    } catch (error) {
        res.send({ status: "error", error: error.message });
    }
});

// DELETE INACTIVE USERS
usersRouter.delete("/", async (req, res) => {
    try {
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
        //Encontrar los usuarios inactivos.
        const inactiveUsers = await userModel.find({
            last_connection: { $lt: twoDaysAgo },
        });
        //Enviar un correo electrónico a cada usuario inactivo.
        for (const user of inactiveUsers) {
            await sendAccountDeletionEmail(user.email);
        }
        //Eliminar los usuarios inactivos
        const deletedUsers = await userModel.deleteMany({
            _id: { $in: inactiveUsers.map((user) => user._id) },
        });
        res.send({ status: "success", message: `Se eliminaron exitosamente los ${deletedUsers.deletedCount} usuarios inactivos.` });
    } catch (error) {
        res.send({ status: "error", message: "Error al eliminar usuarios inactivos." });
    }
});

// DELETE ONE USER
usersRouter.delete("/:uid", async (req, res) => {
    try {
        const user = await userModel.findById(req.params.uid);
        if (!user) {
            return res.json({ status: "error", message: "Usuario no encontrado." });
        }
        // Eliminar el usuario.
        await userModel.findByIdAndDelete(req.params.uid);
        res.send({ status: "success", message: "Usuario eliminado exitosamente." });
    } catch (error) {
        res.send({ status: "error", message: "Error al intentar eliminar el usuario." });
    }
});

export default usersRouter;