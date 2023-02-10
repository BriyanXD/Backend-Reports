import { DataTypes, Model } from "sequelize";
import { TInventory } from "../../types";
import sequelize from "../db";



class Inventory extends Model<TInventory>{}

Inventory.init({
  id: {
  type: DataTypes.INTEGER,
  autoIncrement: true,
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

/* const Inventory = sequelize.define(
  "inventory",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    entryDate: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
    },
    exitDate: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
    },
    storage: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
  },
  { timestamps: false }
); */