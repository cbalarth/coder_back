import winston from "winston";
import * as dotenv from "dotenv";
import { __dirname } from "../utils.js";
import path from "path";
dotenv.config();

const customLevels = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5,
    },
    colors: {
        fatal: "red",
        error: "orange",
        warning: "yellow",
        info: "blue",
        http: "green",
        debug: "purple"
    }
}

winston.addColors(customLevels.colors);

const devLogger = winston.createLogger({
    levels: customLevels.levels,
    transports: [
        new winston.transports.Console({ level: "debug" }) //Registra en consola desde "level" indicado hacia el nivel inicial.
    ]
});

const prodLogger = winston.createLogger({
    levels: customLevels.levels,
    transports: [
        new winston.transports.Console({ level: "info" }), //Registra en consola desde "level" indicado hacia el nivel inicial.
        new winston.transports.File({ filename: path.join(__dirname, "/logs/errors.log"), level: "error" }) //Registra en archivo desde "level" indicado hacia el nivel inicial.
    ]
});

const currentEnv = process.env.NODE_ENV;
export const addLogger = (req, res, next) => {
    if (currentEnv === "dev") {
        req.logger = devLogger
    } else {
        req.logger = prodLogger
    }
    req.logger.error(`ROUTE: ${req.url} - METHOD: ${req.method}`); //Debe ser del nivel del logger o hacia mayor prioridad.
    next();
}