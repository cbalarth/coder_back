// // MANAGERS
// import DbProductManager from "../1_persistence/db-managers/productManager.js";
// import DbCartManager from "../1_persistence/db-managers/cartManager.js";
// import FileProductManager from "../1_persistence/file-managers/productManager.js";
// import FileCartManager from "../1_persistence/file-managers/cartManager.js";

// // PERSISTENCE CONFIGURATION
// const persistenceConfig = {
//     persistenceType: "db",
// };
// let productManager, cartManager;
// if (persistenceConfig.persistenceType === "db") {
//     productManager = DbProductManager;
//     cartManager = DbCartManager;
// } else if (persistenceConfig.persistenceType === "file") {
//     productManager = FileProductManager;
//     cartManager = FileCartManager;
// } else {
//     throw new Error("Unknown persistenceType.");
// }

// export { productManager, cartManager, persistenceConfig };