export const productsCollection = "products";
export const cartsCollection = "carts";
export const usersCollection = "users";
export const chatCollection = "messages";
export const ticketsCollection = "tickets";

export const EnumError = {
    ROUTING_ERROR: 1, //Error de ruta no existente.
    DATABASE_ERROR: 2, //Error con base de datos.
    INVALID_JSON: 3, //Error con ingreso de información en body.
    AUTH_ERROR: 4, //Error de autenticación.
    INVALID_PARAM: 5, //Error con ingreso de params.
}