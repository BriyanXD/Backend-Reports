import { Request, Response } from "express";
import Sales from "../models/Sale";
import Product from "../models/Product";
import {
  UpdateQuantityOfProduct,
} from "./Product.controller";
import { handleError, handleErrorHttp } from "../utils/error";

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
  const { createdAt } = req.query;
  try {
      const allSales = await GetSalesByDate(createdAt ? String(createdAt) : null)
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

export { PostNewSale, GetSales };
