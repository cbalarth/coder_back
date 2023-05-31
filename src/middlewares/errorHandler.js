import { EnumError } from "../constants/index.js";

export const errorHandler = (error, req, res, next) => {
    switch (error.code) {
        case EnumError.ROUTING_ERROR:
            res.json({ status: "Error", error: error.cause, message: error.message })
            break;
        case EnumError.DATABASE_ERROR:
            res.json({ status: "Error", error: error.cause, message: error.message })
            break;
        case EnumError.INVALID_JSON:
            res.json({ status: "Error", error: error.cause, message: error.message })
            break;
        case EnumError.AUTH_ERROR:
            res.json({ status: "Error", error: error.cause, message: error.message })
            break;
        case EnumError.INVALID_PARAM:
            res.json({ status: "Error", error: error.cause, message: error.message })
            break;           
        default:
            res.json({ status: "Error", message: "Hubo un error, contacte al equipo de soporte." })
            break;
    }
}