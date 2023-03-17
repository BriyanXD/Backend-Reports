"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const User_controller_1 = require("../controllers/User.controller");
const Product_controller_1 = require("../controllers/Product.controller");
const Sale_controller_1 = require("../controllers/Sale.controller");
const Inventory_controller_1 = require("../controllers/Inventory.controller");
const routes = (0, express_1.Router)();
//* Ruta Raiz
routes.get("/", User_controller_1.MostrarUsuario);
//* Rutas Producto
routes.get("/product", Product_controller_1.GetAllProducts);
routes.post("/product", Product_controller_1.PostNewProduct);
routes.put("/product", Product_controller_1.UpdateQuantity);
routes.delete("/product/:id", Product_controller_1.DeleteProduct);
//* Rutas Ventas
routes.post("/sale", Sale_controller_1.PostNewSale);
routes.get("/sale", Sale_controller_1.GetSales);
routes.put("/sale/:id", Sale_controller_1.UpdateSale);
routes.delete("/sale/:id", Sale_controller_1.deleteSale);
//* Rutas Inventario
routes.get("/inventory", Inventory_controller_1.GetAllHistorialTheInventory);
routes.post("/inventory", Inventory_controller_1.PostNewRegisterInTheInventory);
routes.put("/inventory", Inventory_controller_1.UpdateIventory);
routes.delete("/inventory/:id", Inventory_controller_1.DelelteInventory);
exports.default = routes;
