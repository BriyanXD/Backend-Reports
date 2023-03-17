"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const config_1 = require("./config");
const sequelize = new sequelize_1.Sequelize(`postgres://${config_1.USER_DB}:${config_1.PASS_DB}@${config_1.HOST_DB}:${config_1.PORT_DB}/${config_1.NAME_DB}`);
exports.default = sequelize;
