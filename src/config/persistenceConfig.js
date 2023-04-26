// MANAGERS
import DbProductManager from "../dao/db-managers/productManager.js";
import DbCartManager from "../dao/db-managers/cartManager.js";
import FileProductManager from "../dao/file-managers/productManager.js";
import FileCartManager from "../dao/file-managers/cartManager.js";

// PERSISTENCE CONFIGURATION
const persistenceConfig = {
    persistenceType: "db",
};
let productManager, cartManager;
if (persistenceConfig.persistenceType === "db") {
    productManager = DbProductManager;
    cartManager = DbCartManager;
} else if (persistenceConfig.persistenceType === "file") {
    productManager = FileProductManager;
    cartManager = FileCartManager;
} else {
    throw new Error("Unknown persistenceType.");
}

export {productManager, cartManager, persistenceConfig};