import { Model, DataTypes } from "sequelize";
import { TProduct } from "../../types";
import sequelize from "../db";


class Product extends Model<TProduct> {}

Product.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  condition: {
    type: DataTypes.STRING,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  unit: {
    type: DataTypes.STRING,
  },
},{
  sequelize,
  tableName:"products",
  timestamps:false
})

export default Product;