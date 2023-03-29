// MANAGERS
import DbProductManager from "./db-managers/productManager.js";
import DbCartManager from "./db-managers/cartManager.js";
import FileProductManager from "./file-managers/productManager.js";
import FileCartManager from "./file-managers/cartManager.js";

// CONDITIONAL CONFIGURATION
const config = {
    persistenceType: "db",
};
let productManager, cartManager;
if (config.persistenceType === "db") {
    productManager = DbProductManager;
    cartManager = DbCartManager;
} else if (config.persistenceType === "file") {
    productManager = FileProductManager;
    cartManager = FileCartManager;
} else {
    throw new Error("Unknown persistenceType.");
}

export {productManager, cartManager, config};