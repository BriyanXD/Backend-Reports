"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../db"));
class Inventory extends sequelize_1.Model {
}
Inventory.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    quantity: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    entryDate: {
        type: sequelize_1.DataTypes.DATEONLY,
    },
    exitDate: {
        type: sequelize_1.DataTypes.DATEONLY,
    },
    destiny: {
        type: sequelize_1.DataTypes.STRING,
    },
    storage: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
    }
}, {
    sequelize: db_1.default,
    modelName: "inventories",
    timestamps: false
});
exports.default = Inventory;
