// import express from "express";
// import path from "path";
// import { fileURLToPath } from "url";

// /**
//  * @description middleware que sirve archivos estáticos desde /public
//  * @returns {Function} /static
//  */

// const staticFilesMiddleware = () => {
//     const __filename = fileURLToPath(import.meta.url);
//     const __dirname = path.dirname(__filename);
//     return express.static(path.join(__dirname, "../public"));// http://localhost:3000/static/products_screen/headphones.jpg
// }

// export default staticFilesMiddleware;