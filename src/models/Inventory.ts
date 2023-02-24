import { DataTypes, Model } from "sequelize";
import { TInventory } from "../../types";
import sequelize from "../db";



class Inventory extends Model<TInventory>{}

Inventory.init({
  id: {
  type: DataTypes.UUID,
  defaultValue: DataTypes.UUIDV4,
  primaryKey: true,
  allowNull: false,
},
quantity: {
  type: DataTypes.INTEGER,
  allowNull: false,
},
entryDate: {
  type: DataTypes.DATEONLY,
},
exitDate: {
  type: DataTypes.DATEONLY,
},
destiny: {
  type: DataTypes.STRING,
},
storage: {
  type: DataTypes.STRING,
  allowNull: false,
},
description: {
  type: DataTypes.TEXT,
}},{
  sequelize,
  modelName:"inventories",
  timestamps:false
})

export default Inventory;