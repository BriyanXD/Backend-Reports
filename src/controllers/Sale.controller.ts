import { Request, Response } from "express";
import Sales from "../models/Sale";
import Product from "../models/Product";
import {
  getAllProductsByName,
  UpdateQuantityOfProduct,
} from "./Product.controller";
import { handleError, handleErrorHttp } from "../utils/error";
import { TProduct } from "../../types";

//* Crea el registro de una nueva venta
const PostNewSale = async (req:Request, res:Response)=> {
  try {
    const { quantity, productId } = req.body; 

    const currentDate = new Date();
    const currentTime = currentDate.getHours() + ":" + currentDate.getMinutes();

    let currentProduct = await Product.findByPk(productId);
    let price = Number(currentProduct?.getDataValue("price"))
        const newSale = await Sales.create({
          ...req.body,
          creationTime: currentTime,
          total: quantity * price,
        });
        await UpdateQuantityOfProduct(productId, quantity, "substract");
        return res.json(newSale);
  } catch (error) {
    return handleErrorHttp(res, 400, "POST_SALE", error)
  }
};

//* Busca todas las ventas
const GetSales = async (req:Request, res:Response) => {
  const { createdAt, name } = req.query;
  try {
      if(name){
        const allSales = await GetSalesByNameProduct(name ? String(name) : "")
        return res.json(allSales)
      }
      const allSales = await GetSalesByDate(createdAt? String(createdAt): "" )
      return res.json(allSales)
    } catch (error) {
    return handleErrorHttp(res, 400, "GET_SALE", error)
  }
};

//* Busca todas las ventas por fecha
const GetSalesByDate = async (createdAt?:string | null) => {
  try {
      const where = createdAt ? { createdAt } : {}
        const allSalesByDate = await Sales.findAll({
          where,
          include: {
            model: Product,
            as: "product",
            attributes: ["name", "price", "category","quantity"],
          },
        });
        return allSalesByDate;
  } catch (error) {
    return handleError("GET_SALE_BY_DATE",error)
  }
};

const deleteSale = async (req:Request, res:Response)=> {
  try {
    const { id } = req.params;
    const {productId, quantity} = req.body
    const saleDeleted = await Sales.destroy({where:{id}})
    await UpdateQuantityOfProduct(productId, quantity, "add");
    res.json(saleDeleted)
  } catch (error) {
    handleErrorHttp(res, 500, "DELETE_SALE", error)
  }
}

const UpdateSale = async (req:Request, res:Response) => {
  const { id } = req.params;
  const { quantity, total, product, productId } = req.body;
  try {
    let currentTotal = 0;
    if(total) currentTotal = total
    else currentTotal = quantity * product.price;

    const calculated = await calculateQuantity(Number(id), quantity);

    if(calculated.result > product.quantity) throw new Error('La cantidad excede el stock disponible');

    await Sales.update({quantity,total:currentTotal}
      ,{ where: { id } })

    await UpdateQuantityOfProduct(productId, calculated.result, calculated.type);

    const saleUpdated = await Sales.findOne({where:{id}, include:{ model: Product, as: "product", attributes: ["name", "price", "category","quantity"],}})
    res.json(saleUpdated)
  } catch (error) {
    handleErrorHttp(res,500,"UPDATE_SALE",error);
  }
}

//* Busca todas las ventas por fecha
const GetSalesByNameProduct = async (name?:string | null) => {
  try {
      const product = await getAllProductsByName(String(name)) as TProduct
      const where = product ? { productId:product?.id } : {}
        const allSalesByName = await Sales.findAll({
          where,
          include: {
            model: Product,
            as: "product",
            attributes: ["name", "price", "category","quantity"],
          },
        });
        return allSalesByName;
  } catch (error) {
    return handleError("GET_SALE_BY_NAME",error)
  }
};


const calculateQuantity = async (id:number, currentQuantity:number) => {
  try {
    const sale = await Sales.findByPk(id);
    if(!sale) return
    let previusQuantity = sale?.getDataValue("quantity");
    if(currentQuantity > previusQuantity) return {result:currentQuantity - previusQuantity, type:"substract"}
    if(currentQuantity < previusQuantity) return {result:previusQuantity - currentQuantity, type:"add"}
    return {result:currentQuantity, type: "otro"}
  } catch (error) {
    return handleError("CALCULATE_QUANTITY",error);
  }
}


export { PostNewSale, GetSales, GetSalesByNameProduct, UpdateSale, calculateQuantity, deleteSale };
