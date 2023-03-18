import express from "express";
import sequelize from "./db";
import routes from "./routes/index.routes";
import Product from "./models/Product";
import Sales from "./models/Sale";
import cookieParser from "cookie-parser";
import Inventory from "./models/Inventory";
import morgan from "morgan";
import { PORT_APP, ROUTE } from "./config";
const app = express();


//* Puerto y midlewares

app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(morgan('dev'))
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", `${ROUTE}`); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept",
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});
app.use(routes);


//* Relaciones de las tablas
Product.hasMany(Sales , {as:"product", foreignKey:"productId"});
Sales.belongsTo(Product, {as:"product", foreignKey:"productId"});

Product.hasOne(Inventory,{as: "prod", foreignKey:"productId"});
Inventory.belongsTo(Product, {as: "prod", foreignKey:"productId"});

//* Escucha del servidor y la BD
app.listen(PORT_APP, () => {
  console.log(`🚀 Server listening on port ${PORT_APP}`);
  console.log(`route: ${ROUTE}`);
  sequelize
    .sync({ force: true })
    .then(() => console.log("🆗 Database connected successfully"))
});
