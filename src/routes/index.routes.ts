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
  UpdateSale
} from "../controllers/Sale.controller";

import {
  GetAllHistorialTheInventory,
  PostNewRegisterInTheInventory,
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
//* Rutas Inventario
routes.get("/inventory", GetAllHistorialTheInventory);
routes.post("/inventory", PostNewRegisterInTheInventory);
export default routes;
