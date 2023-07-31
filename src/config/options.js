import dotenv from "dotenv";
dotenv.config();

//IMPORTA VARIABLES DE ENTORNO
const PORT = process.env.PORT;
const MONGO_DB_USER = process.env.MONGO_DB_USER;
const MONGO_DB_PASS = process.env.MONGO_DB_PASS;
const MONGO_DB_NAME = process.env.MONGO_DB_NAME;
const SECRET_TOKEN = process.env.SECRET_TOKEN;
const COOKIE_TOKEN = process.env.COOKIE_TOKEN;
const PERSISTENCE = process.env.PERSISTENCE;
const EMAIL_ADMIN = process.env.EMAIL_ADMIN;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
const SECRET_TOKEN_EMAIL = process.env.SECRET_TOKEN_EMAIL;

//OBJETO PARA UTILIZAR DE MANERA ORGANIZADA LAS VARIABLES DE ENTORNO
const options = {
    persistence: PERSISTENCE,
    database: {
        url: `mongodb+srv://${MONGO_DB_USER}:${MONGO_DB_PASS}@codercluster.jhyle2f.mongodb.net/${MONGO_DB_NAME}?retryWrites=true&w=majority`
    },
    server: {
        port: PORT,
        secretToken: SECRET_TOKEN,
        cookieToken: COOKIE_TOKEN
    },
    gmail: {
        emailAdmin: EMAIL_ADMIN,
        emailPass: EMAIL_PASSWORD,
        emailToken: SECRET_TOKEN_EMAIL
    }
};

export { options };