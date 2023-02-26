import Product from "../models/Product";
import { Request, Response } from "express";
import {handleError, handleErrorHttp} from "../utils/error";
import { Operation } from "../../types";
import sequelize from "sequelize";

//* Peticiones
//* Obetener todos los Productos o un solo producto por su Id
const GetAllProducts = async (req:Request, res:Response) => {
  const { productId } = req.query;
  try {
    const products:Product = await GetAllProductsOrProductByName(String(productId))as Product;
    return res.json(products);
  } catch (error) {
    return handleErrorHttp(res, 400, 'ERROR_GET_ALL_PRODUCTS', error)
  }
};

//*Crear nuevo producto
const PostNewProduct = async (req:Request, res:Response) => {
  try {
    const {name, price, quantity, condition, category, unit } = req.body
    const conditionVerified = verifyCondition(condition, quantity)
    const newProduct:Product = await Product.create({name, price, quantity, condition:conditionVerified, category, unit }) as Product;
    res.json(newProduct);
  } catch (error) {
    return handleErrorHttp(res, 400, 'ERROR_POST_PRODUCTS',error)
  }
};

//*Actualizar cantidad del producto
  const UpdateQuantity = async (req:Request, res:Response) => {
  const { productId } = req.query;
  const {name, price, quantity, category, unit } = req.body;

  try {
    if (!productId) throw new Error("Faltan datos: productId o product");
    const conditionVerified = verifyCondition("", quantity)
    await Product.update({name, price, quantity, condition:conditionVerified, category, unit },{where:{id:String(productId)}})
    const product = await Product.findByPk(String(productId))
    res.send(product)
  } catch (error) {
    return handleErrorHttp(res, 400, 'ERROR_UPDATE_PRODUCTS',error)
  }
};

//*Borrar producto
const DeleteProduct = async(req:Request, res:Response)=> {
  try {
      const {id} = req.params;
      const productDeleted = await Product.destroy({where:{id}});
      res.json(productDeleted);
  } catch (error) {
    return handleErrorHttp(res, 400, 'ERROR_DELETE_PRODUCT', error);
  }
} 

//* Funciones
const verifyCondition = (condition:string, quantity:number):string => {
  if(condition && condition !== "")return condition
  if(quantity <= 5)return "danger";
  if(quantity <= 10)return "warning";
  if(quantity > 50)return "hight";
  return "ok"
}

//*Funcion que obtiene todos los productos
const GetAllProductsOrProductByName = async (productId?: string) => {
  try {
    if (!productId || productId == 'undefined') {
      const products: Product[] = await Product.findAll() as Product[];
      return products;
    } else {
      const product: Product = await Product.findByPk(productId) as Product;
      return product;
    }
  } catch (error) {
    return handleError("FUNCTION_GET_PRODUCT_BY_NAME",error)
  }
};

const getAllProductsByName = async(name:string) => {
  try {
    const where = name ? sequelize.where(
      sequelize.fn('lower', sequelize.col('name')),
      sequelize.fn('lower', name)
    ) : {}
    const productsByName = await Product.findOne({where})
    return productsByName;
  } catch (error) {
    return handleError("FUNCTION_GET_PRODUCT",error)
  }
}

//*Actualizar la cantidad del producto dependiento del tipo de entrada
 

const UpdateQuantityOfProduct = async (productId:number, newQuantity:number, type?:Operation) => {
  try {

    if(type !== "add" && type !== "substract") return

    const product:Product = await Product.findByPk(productId) as Product;
    let quantityProduct = product?.getDataValue("quantity");
    let cantidad = 0;
    
    if(!quantityProduct)throw new Error("the property: quantity of product is not found")
    if(type === "substract")cantidad = Number(quantityProduct) - Number(newQuantity)
    else cantidad = Number(quantityProduct) + Number(newQuantity)
        
    let conditionVerified = verifyCondition("",cantidad)
    
    if(cantidad || cantidad === 0){
      const updatedProduct = await Product.update(
        { quantity: cantidad || 0, condition: conditionVerified },
        { where: { id: productId } }
        );
      return updatedProduct;
    }
    } catch (error) {
      return handleError("FUNCTION_GET_PRODUCT",error)
  }
};
export {
  GetAllProducts,
  PostNewProduct,
  UpdateQuantity,
  UpdateQuantityOfProduct,
  GetAllProductsOrProductByName,
  DeleteProduct,
  getAllProductsByName
};
