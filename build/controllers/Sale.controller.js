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
exports.deleteSale = exports.calculateQuantity = exports.UpdateSale = exports.GetSalesByNameProduct = exports.GetSales = exports.PostNewSale = void 0;
const Sale_1 = __importDefault(require("../models/Sale"));
const Product_1 = __importDefault(require("../models/Product"));
const Product_controller_1 = require("./Product.controller");
const error_1 = require("../utils/error");
//* Crea el registro de una nueva venta
const PostNewSale = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { quantity, productId } = req.body;
        const currentDate = new Date();
        const currentTime = currentDate.getHours() + ":" + currentDate.getMinutes();
        let currentProduct = yield Product_1.default.findByPk(productId);
        let price = Number(currentProduct === null || currentProduct === void 0 ? void 0 : currentProduct.getDataValue("price"));
        const newSale = yield Sale_1.default.create(Object.assign(Object.assign({}, req.body), { creationTime: currentTime, total: quantity * price }));
        yield (0, Product_controller_1.UpdateQuantityOfProduct)(productId, quantity, "substract");
        return res.json(newSale);
    }
    catch (error) {
        return (0, error_1.handleErrorHttp)(res, 400, "POST_SALE", error);
    }
});
exports.PostNewSale = PostNewSale;
//* Busca todas las ventas
const GetSales = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { createdAt, name } = req.query;
    try {
        if (name) {
            const allSales = yield GetSalesByNameProduct(name ? String(name) : "");
            return res.json(allSales);
        }
        const allSales = yield GetSalesByDate(createdAt ? String(createdAt) : "");
        return res.json(allSales);
    }
    catch (error) {
        return (0, error_1.handleErrorHttp)(res, 400, "GET_SALE", error);
    }
});
exports.GetSales = GetSales;
//* Busca todas las ventas por fecha
const GetSalesByDate = (createdAt) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const where = createdAt ? { createdAt } : {};
        const allSalesByDate = yield Sale_1.default.findAll({
            where,
            include: {
                model: Product_1.default,
                as: "product",
                attributes: ["name", "price", "category", "quantity"],
            },
        });
        return allSalesByDate;
    }
    catch (error) {
        return (0, error_1.handleError)("GET_SALE_BY_DATE", error);
    }
});
const deleteSale = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { productId, quantity } = req.body;
        const saleDeleted = yield Sale_1.default.destroy({ where: { id } });
        yield (0, Product_controller_1.UpdateQuantityOfProduct)(productId, quantity, "add");
        res.json(saleDeleted);
    }
    catch (error) {
        (0, error_1.handleErrorHttp)(res, 500, "DELETE_SALE", error);
    }
});
exports.deleteSale = deleteSale;
const UpdateSale = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { quantity, total, product, productId } = req.body;
    try {
        let currentTotal = 0;
        if (total)
            currentTotal = total;
        else
            currentTotal = quantity * product.price;
        const calculated = yield calculateQuantity(Number(id), quantity);
        if (calculated.result > product.quantity)
            throw new Error('La cantidad excede el stock disponible');
        yield Sale_1.default.update({ quantity, total: currentTotal }, { where: { id } });
        yield (0, Product_controller_1.UpdateQuantityOfProduct)(productId, calculated.result, calculated.type);
        const saleUpdated = yield Sale_1.default.findOne({ where: { id }, include: { model: Product_1.default, as: "product", attributes: ["name", "price", "category", "quantity"], } });
        res.json(saleUpdated);
    }
    catch (error) {
        (0, error_1.handleErrorHttp)(res, 500, "UPDATE_SALE", error);
    }
});
exports.UpdateSale = UpdateSale;
//* Busca todas las ventas por fecha
const GetSalesByNameProduct = (name) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield (0, Product_controller_1.getAllProductsByName)(String(name));
        const where = product ? { productId: product === null || product === void 0 ? void 0 : product.id } : {};
        const allSalesByName = yield Sale_1.default.findAll({
            where,
            include: {
                model: Product_1.default,
                as: "product",
                attributes: ["name", "price", "category", "quantity"],
            },
        });
        return allSalesByName;
    }
    catch (error) {
        return (0, error_1.handleError)("GET_SALE_BY_NAME", error);
    }
});
exports.GetSalesByNameProduct = GetSalesByNameProduct;
const calculateQuantity = (id, currentQuantity) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sale = yield Sale_1.default.findByPk(id);
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
exports.calculateQuantity = calculateQuantity;
