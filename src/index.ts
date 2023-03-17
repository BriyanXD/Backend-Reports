import express from "express";
import sequelize from "./db";
import routes from "./routes/index.routes";
import Product from "./models/Product";
import Sales from "./models/Sale";
import Inventory from "./models/Inventory";
import cors from "cors";
import morgan from "morgan";
import { HOST_APP, PORT_APP } from "./config";
const app = express();


//* Puerto y midlewares
app.use(express.json());
app.use(cors({
  "origin": "*",
  "methods": "GET,PUT,POST,DELETE",
}))
app.use(morgan('dev'))
app.use(routes);

//* Relaciones de las tablas
Product.hasMany(Sales , {as:"product", foreignKey:"productId"});
Sales.belongsTo(Product, {as:"product", foreignKey:"productId"});

Product.hasOne(Inventory,{as: "prod", foreignKey:"productId"});
Inventory.belongsTo(Product, {as: "prod", foreignKey:"productId"});

//* Escucha del servidor y la BD
app.listen(PORT_APP, () => {
  console.log(`🚀 Server listening on port ${PORT_APP}`);
  console.log(`➡️ http://${HOST_APP}:${PORT_APP}`);
  sequelize
    .sync({ force: false })
    .then(() => console.log("🆗 Database connected successfully"));
});
