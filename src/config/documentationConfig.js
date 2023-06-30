import { __dirname } from "../utils.js";
import swaggerJsDoc from "swagger-jsdoc";

const swaggerOptions = {
    definition: {
        openapi: "3.0.1",
        info: {
            title: "Documentación API eCommerce",
            version: "1.0.1",
            description: "Definicion de endpoints para la API eCommerce."
        }
    },
    apis: [`${__dirname}/docs/**/*.yaml`],
};

export const swaggerSpecs = swaggerJsDoc(swaggerOptions);