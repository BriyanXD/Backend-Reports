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
        const allSales = await GetSalesByName(name ? String(name) : "")
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
            attributes: ["name", "price", "category"],
          },
        });
        return allSalesByDate;
  } catch (error) {
    return handleError("GET_SALE_BY_DATE",error)
  }
};

const UpdateSale = async (req:Request, res:Response) => {
  const { id } = req.params;
  const { quantity, total } = req.body;
  try {
    if(!id) return
    console.log(id ,"esto");
    const saleToUpdate = await Sales.update({quantity,total}
      ,{ where: {productId: id} })
    console.log(saleToUpdate);
    res.json(saleToUpdate)
  } catch (error) {
    handleErrorHttp(res,500,"UPDATE_SALE",error);
  }
}

//* Busca todas las ventas por fecha
const GetSalesByName = async (name?:string | null) => {
  try {
      const product = await getAllProductsByName(String(name)) as TProduct
      const where = product ? { productId:product?.id } : {}
        const allSalesByName = await Sales.findAll({
          where,
          include: {
            model: Product,
            as: "product",
            attributes: ["name", "price", "category"],
          },
        });
        return allSalesByName;
  } catch (error) {
    return handleError("GET_SALE_BY_NAME",error)
  }
};
export { PostNewSale, GetSales, GetSalesByName, UpdateSale };
