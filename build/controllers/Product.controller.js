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
exports.getAllProductsByName = exports.DeleteProduct = exports.GetAllProductsOrProductByName = exports.UpdateQuantityOfProduct = exports.UpdateQuantity = exports.PostNewProduct = exports.GetAllProducts = void 0;
const Product_1 = __importDefault(require("../models/Product"));
const error_1 = require("../utils/error");
const sequelize_1 = __importDefault(require("sequelize"));
//* Peticiones
//* Obetener todos los Productos o un solo producto por su Id
const GetAllProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.query;
    try {
        const products = yield GetAllProductsOrProductByName(String(productId));
        return res.json(products);
    }
    catch (error) {
        return (0, error_1.handleErrorHttp)(res, 400, 'ERROR_GET_ALL_PRODUCTS', error);
    }
});
exports.GetAllProducts = GetAllProducts;
//*Crear nuevo producto
const PostNewProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, price, quantity, condition, category, unit } = req.body;
        const conditionVerified = verifyCondition(condition, quantity);
        const newProduct = yield Product_1.default.create({ name, price, quantity, condition: conditionVerified, category, unit });
        res.json(newProduct);
    }
    catch (error) {
        return (0, error_1.handleErrorHttp)(res, 400, 'ERROR_POST_PRODUCTS', error);
    }
});
exports.PostNewProduct = PostNewProduct;
//*Actualizar cantidad del producto
const UpdateQuantity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.query;
    const { name, price, quantity, category, unit } = req.body;
    try {
        if (!productId)
            throw new Error("Faltan datos: productId o product");
        const conditionVerified = verifyCondition("", quantity);
        yield Product_1.default.update({ name, price, quantity, condition: conditionVerified, category, unit }, { where: { id: String(productId) } });
        const product = yield Product_1.default.findByPk(String(productId));
        res.send(product);
    }
    catch (error) {
        return (0, error_1.handleErrorHttp)(res, 400, 'ERROR_UPDATE_PRODUCTS', error);
    }
});
exports.UpdateQuantity = UpdateQuantity;
//*Borrar producto
const DeleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const productDeleted = yield Product_1.default.destroy({ where: { id } });
        res.json(productDeleted);
    }
    catch (error) {
        return (0, error_1.handleErrorHttp)(res, 400, 'ERROR_DELETE_PRODUCT', error);
    }
});
exports.DeleteProduct = DeleteProduct;
//* Funciones
const verifyCondition = (condition, quantity) => {
    if (condition && condition !== "")
        return condition;
    if (quantity <= 5)
        return "danger";
    if (quantity <= 10)
        return "warning";
    if (quantity > 50)
        return "hight";
    return "ok";
};
//*Funcion que obtiene todos los productos
const GetAllProductsOrProductByName = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!productId || productId == 'undefined') {
            const products = yield Product_1.default.findAll();
            return products;
        }
        else {
            const product = yield Product_1.default.findByPk(productId);
            return product;
        }
    }
    catch (error) {
        return (0, error_1.handleError)("FUNCTION_GET_PRODUCT_BY_NAME", error);
    }
});
exports.GetAllProductsOrProductByName = GetAllProductsOrProductByName;
const getAllProductsByName = (name) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const where = name ? sequelize_1.default.where(sequelize_1.default.fn('lower', sequelize_1.default.col('name')), sequelize_1.default.fn('lower', name)) : {};
        const productsByName = yield Product_1.default.findOne({ where });
        return productsByName;
    }
    catch (error) {
        return (0, error_1.handleError)("FUNCTION_GET_PRODUCT", error);
    }
});
exports.getAllProductsByName = getAllProductsByName;
//*Actualizar la cantidad del producto dependiento del tipo de entrada
const UpdateQuantityOfProduct = (productId, newQuantity, type) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (type !== "add" && type !== "substract")
            return;
        const product = yield Product_1.default.findByPk(productId);
        let quantityProduct = product === null || product === void 0 ? void 0 : product.getDataValue("quantity");
        let cantidad = 0;
        if (!quantityProduct)
            throw new Error("the property: quantity of product is not found");
        if (type === "substract")
            cantidad = Number(quantityProduct) - Number(newQuantity);
        else
            cantidad = Number(quantityProduct) + Number(newQuantity);
        let conditionVerified = verifyCondition("", cantidad);
        if (cantidad || cantidad === 0) {
            const updatedProduct = yield Product_1.default.update({ quantity: cantidad || 0, condition: conditionVerified }, { where: { id: productId } });
            return updatedProduct;
        }
    }
    catch (error) {
        return (0, error_1.handleError)("FUNCTION_UPDATE_QUANTITY_PRODUCT", error);
    }
});
exports.UpdateQuantityOfProduct = UpdateQuantityOfProduct;
