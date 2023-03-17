"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = exports.handleErrorHttp = void 0;
//* Manejo de errores para consultas de la API
const handleErrorHttp = (res, status, name, error) => {
    console.log("\n" + name + "\n\n" + error + "\n");
    res.status(status).json({ status, name, error });
};
exports.handleErrorHttp = handleErrorHttp;
//* Manejo de errores para servicios de las consultas
const handleError = (name, error) => {
    console.log("\n" + name + "\n\n" + error + "\n");
    return error;
};
exports.handleError = handleError;
