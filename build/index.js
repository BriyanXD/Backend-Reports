"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./db"));
const index_routes_1 = __importDefault(require("./routes/index.routes"));
const Product_1 = __importDefault(require("./models/Product"));
const Sale_1 = __importDefault(require("./models/Sale"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const Inventory_1 = __importDefault(require("./models/Inventory"));
const morgan_1 = __importDefault(require("morgan"));
const config_1 = require("./config");
const app = (0, express_1.default)();
//* Puerto y midlewares
app.use(express_1.default.urlencoded({ extended: true, limit: "50mb" }));
app.use(express_1.default.json({ limit: "50mb" }));
app.use((0, cookie_parser_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", `${config_1.ROUTE}`); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    next();
});
app.use(index_routes_1.default);
//* Relaciones de las tablas
Product_1.default.hasMany(Sale_1.default, { as: "product", foreignKey: "productId" });
Sale_1.default.belongsTo(Product_1.default, { as: "product", foreignKey: "productId" });
Product_1.default.hasOne(Inventory_1.default, { as: "prod", foreignKey: "productId" });
Inventory_1.default.belongsTo(Product_1.default, { as: "prod", foreignKey: "productId" });
//* Escucha del servidor y la BD
app.listen(config_1.PORT_APP, () => {
    console.log(`🚀 Server listening on port ${config_1.PORT_APP}`);
    console.log(`route: ${config_1.ROUTE}`);
    db_1.default
        .sync({ force: true })
        .then(() => console.log("🆗 Database connected successfully"));
});
