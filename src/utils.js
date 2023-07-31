import { fileURLToPath } from "url";
import multer from "multer";
import path from "path";
import { dirname } from "path";
import bcrypt from "bcrypt";
import { Faker, en } from "@faker-js/faker";
import jwt from "jsonwebtoken";
import { options } from "./config/options.js";
import express from "express";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//HASHEO CONSTRASEÑA
const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync())
};

//VALIDACIÓN CONTRASEÑA
const isValidPassword = (loginPassword, user) => {
    return bcrypt.compareSync(loginPassword, user.password);
};

//FAKER MOCKING
const customFaker = new Faker({
    locale: [en],
});
const { commerce, image, database, string } = customFaker;
const generateMockingProduct = () => {
    return {
        _id: database.mongodbObjectId(),
        title: commerce.productName(),
        description: commerce.productDescription(),
        code: string.alphanumeric(10),
        price: parseFloat(commerce.price()),
        status: true,
        stock: parseInt(string.numeric(2)),
        category: commerce.department(),
        thumbnails: [image.url(), image.url()]
    }
}

//RESTABLECIMIENO CONTRASEÑA - GENERA TOKEN EMAIL
const generateEmailToken = (email, expireTime) => {
    const token = jwt.sign({ email }, options.gmail.emailToken, { expiresIn: expireTime });
    return token;
};

//RESTABLECIMIENO CONTRASEÑA - VALIDA VIGENCIA TOKEN EMAIL
const verifyEmailToken = (token) => {
    try {
        const info = jwt.verify(token, options.gmail.emailToken);
        return info.email;
    } catch (error) {
        console.log(error.message);
        return null;
    }
};

// --- SECCIÓN MULTER ---

//Validación campos signup.
const validFields = (body) => {
    const { first_name, last_name, email, password } = body;
    if (!first_name || !last_name || !email || !password) {
        return false;
    } else {
        return true
    }
};

//Filtro para realizar "validación campos signup" antes de cargar la imagen.
const multerFilterProfile = (req, file, cb) => {
    const isValid = validFields(req.body);
    if (!isValid) {
        cb(null, false)
    } else {
        cb(null, true)
    }
};

//Configuración Almacenamiento Imagenes Users
const userAvatarStorage = multer.diskStorage({
    //Ubicación archivos.
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "/multer/users/images"))
    },
    //Nombre archivos.
    filename: function (req, file, cb) {
        cb(null, `${req.body.email}-perfil-${file.originalname}`)
    }
});
const uploaderUserAvatar = multer({ storage: userAvatarStorage, fileFilter: multerFilterProfile }); //UPLOADER USER AVATAR

//Configuración Almacenamiento Documentos Users
const userDocumentsStorage = multer.diskStorage({
    //Ubicación archivos.
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "/multer/users/documents"))
    },
    //Nombre archivos.
    filename: function (req, file, cb) {
        cb(null, `${req.user.email}-documento-${file.originalname}`)
    }
});
const uploaderUserDocuments = multer({ storage: userDocumentsStorage }); //UPLOADER USER DOCUMENTS

//Configuración Almacenamiento Imagenes Products
const productImagesStorage = multer.diskStorage({
    //Ubicación archivos.
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "/multer/products/images"))
    },
    //Nombre archivos.
    filename: function (req, file, cb) {
        cb(null, `${req.body.code}-imagen-${file.originalname}`) //rev
    }
});
const uploaderProductImages = multer({ storage: productImagesStorage }); //UPLOADER PRODUCT IMAGES

export { __filename, __dirname, createHash, isValidPassword, customFaker, generateMockingProduct, generateEmailToken, verifyEmailToken, uploaderUserAvatar, uploaderUserDocuments, uploaderProductImages };