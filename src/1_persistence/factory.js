import { options } from "../config/options.js";
import { connectDB } from "../config/dbConnection.js";

connectDB();

const persistence = options.persistence;
let productsDao, cartsDao;
switch (persistence) {
    case "db":
        const { productManager } = await import("./db-managers/productManager.js");
        productsDao = new productManager();
        const { cartManager } = await import("./db-managers/cartManager.js");
        cartsDao = new cartManager();
        break;
    case "file":
        const { FileProductManager } = await import("./file-managers/productManager.js");
        productsDao = new FileProductManager();
        const { FileCartManager } = await import("./file-managers/cartManager.js");
        cartsDao = new FileCartManager();
        break;
};

export { productsDao, cartsDao };

// const { userManager } = await import("./db-managers/userManager.js");
// const usersDao = new userManager();

// const { chatManager } = await import("./db-managers/chatManager.js");
// const chatDao = new chatManager();

// export { productsDao, cartsDao, usersDao, chatDao };