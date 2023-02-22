import { Sequelize } from "sequelize";
import { USER_DB, PASS_DB, HOST_DB, PORT_DB, NAME_DB } from "./config";
const sequelize = new Sequelize(
  `postgres://${USER_DB}:${PASS_DB}@${HOST_DB}:${PORT_DB}/${NAME_DB}`
);
export default sequelize;
