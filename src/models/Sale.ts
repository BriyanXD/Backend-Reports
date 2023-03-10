import { DataTypes, Model } from "sequelize";
import { TSale} from "../../types";
import sequelize from "../db";


class Sales extends Model<TSale>{}

Sales.init({
  id: {
  type: DataTypes.UUID,
  defaultValue: DataTypes.UUIDV4,
  primaryKey: true,
  allowNull: false,
  unique: true,
},
quantity: {
  type: DataTypes.INTEGER,
  allowNull: false,
},
total: {
  type: DataTypes.INTEGER,
  allowNull: false,
},
createdAt: {
  type: DataTypes.DATEONLY,
  defaultValue: DataTypes.NOW,
},
creationTime: {
  type: DataTypes.TIME,
},
},{
  sequelize,
  modelName:"sales",
  timestamps:false
})

export default Sales;
