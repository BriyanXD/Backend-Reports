import { Router } from "express";
import { MostrarUsuario } from "../controllers/User.controller";
import {
  DeleteProduct,
  GetAllProducts,
  PostNewProduct,
  UpdateQuantity
} from "../controllers/Product.controller";

import {
  PostNewSale,
  GetSales,
  UpdateSale,
  deleteSale
} from "../controllers/Sale.controller";

import {
  GetAllHistorialTheInventory,
  PostNewRegisterInTheInventory,
  UpdateIventory,
  DelelteInventory
} from "../controllers/Inventory.controller";

const routes = Router();
//* Ruta Raiz
routes.get("/", MostrarUsuario);
//* Rutas Producto
routes.get("/product", GetAllProducts);
routes.post("/product", PostNewProduct);
routes.put("/product",UpdateQuantity)
routes.delete("/product/:id",DeleteProduct)
//* Rutas Ventas
routes.post("/sale", PostNewSale);
routes.get("/sale", GetSales);
routes.put("/sale/:id", UpdateSale)
routes.delete("/sale/:id", deleteSale)
//* Rutas Inventario
routes.get("/inventory", GetAllHistorialTheInventory);
routes.post("/inventory", PostNewRegisterInTheInventory);
routes.put("/inventory",UpdateIventory)
routes.delete("/inventory/:id",DelelteInventory)
export default routes;
