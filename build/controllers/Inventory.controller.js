"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DelelteInventory = exports.UpdateIventory = exports.UpdateDateOfRegisterForType = exports.PostNewRegisterInTheInventory = exports.GetAllHistorialTheInventory = void 0;
const Inventory_1 = __importDefault(require("../models/Inventory"));
const Product_1 = __importDefault(require("../models/Product"));
const Product_controller_1 = require("./Product.controller");
const error_1 = require("../utils/error");
//* Consultas
//* Obtener todos los registros del invetario o Inventarios por fecha
const GetAllHistorialTheInventory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { registerId } = req.query;
        const inventory = yield FunctionGetInventory(String(registerId) || null);
        res.json(inventory);
    }
    catch (error) {
        (0, error_1.handleErrorHttp)(res, 400, "GET_INVENTORY", error);
    }
});
exports.GetAllHistorialTheInventory = GetAllHistorialTheInventory;
//*Crear nuevo registro en Inventario
const PostNewRegisterInTheInventory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { exitDate, entryDate, productId, quantity } = req.body;
    try {
        if (entryDate === "" && exitDate === "")
            throw new Error("Missing data: exitDate or EntryDate");
        if (entryDate && exitDate)
            throw new Error("Select alone one data type: exitDate or EntryDate");
        let type = exitDate ? "substract" : "add";
        const element = yield Inventory_1.default.create(Object.assign(Object.assign({}, req.body), { exitDate: exitDate || null, entryDate: entryDate || null }));
        const newRegister = yield FunctionGetInventory(String(element === null || element === void 0 ? void 0 : element.getDataValue("id")));
        yield (0, Product_controller_1.UpdateQuantityOfProduct)(productId, quantity, type);
        res.json(newRegister);
    }
    catch (error) {
        (0, error_1.handleErrorHttp)(res, 400, "POST_INVENTORY", error);
    }
});
exports.PostNewRegisterInTheInventory = PostNewRegisterInTheInventory;
//*Actualizar la fecha de entrada o salida del invetario
const UpdateIventory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId, quantity, id, exitDate } = req.body;
        const calculated = exitDate ? yield calculateQuantityExit(id, quantity) : yield calculateQuantityEntry(id, quantity);
        yield Inventory_1.default.update(req.body, { where: { id: req.body.id } });
        const inventory = yield FunctionGetInventory(req.body.id);
        yield (0, Product_controller_1.UpdateQuantityOfProduct)(productId, calculated.result, calculated.type);
        res.json(inventory);
    }
    catch (error) {
        (0, error_1.handleErrorHttp)(res, 400, "UPDATE_INVENTORY", error);
    }
});
exports.UpdateIventory = UpdateIventory;
const UpdateDateOfRegisterForType = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { registerId, newDate, type } = req.body;
    try {
        if (!registerId || !newDate || !type)
            throw new Error("Missing data: registerId, newDate o type");
        const registerUpdated = yield FunctionUpdateDateofRegister(registerId, newDate, type);
        res.json(registerUpdated);
    }
    catch (error) {
        (0, error_1.handleErrorHttp)(res, 400, "UPDATE_INVENTORY", error);
    }
});
exports.UpdateDateOfRegisterForType = UpdateDateOfRegisterForType;
const DelelteInventory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const product = yield Inventory_1.default.findByPk(id);
        //! Esta condicion esta invertida al tener que usarse al momento de eliminar un registro
        let type = (product === null || product === void 0 ? void 0 : product.getDataValue("exitDate")) ? "add" : "substract";
        const inventory = yield Inventory_1.default.destroy({ where: { id } });
        yield (0, Product_controller_1.UpdateQuantityOfProduct)(String(product === null || product === void 0 ? void 0 : product.getDataValue("productId")), Number(product === null || product === void 0 ? void 0 : product.getDataValue("quantity")), type);
        res.json(inventory);
    }
    catch (error) {
        (0, error_1.handleErrorHttp)(res, 400, "DELETE_INVENTORY", error);
    }
});
exports.DelelteInventory = DelelteInventory;
//* Funciones
//* Funcion para obtener los registros del invetario
const FunctionGetInventory = (registerId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (registerId === "undefined") {
            const inventory = yield Inventory_1.default.findAll({
                include: {
                    model: Product_1.default,
                    as: "prod",
                    attributes: ["name", "price", "category", "quantity"],
                },
            });
            return inventory;
        }
        else {
            const inventory = yield Inventory_1.default.findByPk(String(registerId), {
                include: {
                    model: Product_1.default,
                    as: "prod",
                    attributes: ["name", "price", "category", "quantity"],
                },
            });
            return inventory;
        }
    }
    catch (error) {
        return (0, error_1.handleError)("FUNCTION_GET_INVENTORY", error);
    }
});
//*Funcion para actulizar la fecha del registro de invetario
const FunctionUpdateDateofRegister = (registerId, newDate, type) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let registerUpdated = yield Inventory_1.default.update({ [`${type}Date`]: newDate }, { where: { id: registerId } });
        return registerUpdated;
    }
    catch (error) {
        return (0, error_1.handleError)("FUNCTION_GET_INVENTORY", error);
    }
});
const calculateQuantityEntry = (id, currentQuantity) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sale = yield Inventory_1.default.findByPk(id);
        if (!sale)
            return;
        let previusQuantity = sale === null || sale === void 0 ? void 0 : sale.getDataValue("quantity");
        if (currentQuantity > previusQuantity)
            return { result: currentQuantity - previusQuantity, type: "add" };
        if (currentQuantity < previusQuantity)
            return { result: previusQuantity - currentQuantity, type: "substract" };
        return { result: currentQuantity, type: "otro" };
    }
    catch (error) {
        return (0, error_1.handleError)("CALCULATE_QUANTITY", error);
    }
});
const calculateQuantityExit = (id, currentQuantity) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sale = yield Inventory_1.default.findByPk(id);
        if (!sale)
            return;
        let previusQuantity = sale === null || sale === void 0 ? void 0 : sale.getDataValue("quantity");
        if (currentQuantity > previusQuantity)
            return { result: currentQuantity - previusQuantity, type: "substract" };
        if (currentQuantity < previusQuantity)
            return { result: previusQuantity - currentQuantity, type: "add" };
        return { result: currentQuantity, type: "otro" };
    }
    catch (error) {
        return (0, error_1.handleError)("CALCULATE_QUANTITY", error);
    }
});
