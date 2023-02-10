import Inventory from"../models/Inventory";
import Product from"../models/Product";
import { UpdateQuantityOfProduct } from"./Product.controller";
import { Request, Response } from "express";
import { Operation } from "../../types";
import {handleErrorHttp,handleError} from "../utils/error";

//* Consultas
//* Obtener todos los registros del invetario o Inventarios por fecha
const GetAllHistorialTheInventory = async (req:Request, res:Response) => {
  try {
    const {registerId} = req.query;
    const inventory = await FunctionGetInventory(registerId ? Number(registerId) : null);
    res.json(inventory);
  } catch (error) {
    handleErrorHttp(res, 400, "GET_INVENTORY", error)
  }
};

//*Crear nuevo registro en Inventario
const PostNewRegisterInTheInventory = async (req:Request, res:Response) => {
  const { productId, quantity, exitDate, entryDate } = req.body;
  try {
    if(!entryDate && !exitDate) throw new Error("Missing data: exitDate or EntryDate")
    if(entryDate && exitDate) throw new Error("Select alone one data type: exitDate or EntryDate")
    let type:Operation = exitDate ? "substract" : "add"
    const newRegister = await Inventory.create(req.body);
    await UpdateQuantityOfProduct(productId, quantity, type);
    res.json(newRegister);
  } catch (error) {
    handleErrorHttp(res, 400, "POST_INVENTORY", error)
  }
};

//*Actualizar la fecha de entrada o salida del invetario
const UpdateDateOfRegisterForType = async (req:Request, res:Response) => {
  const { registerId, newDate, type } = req.body;
  try {
    if (!registerId || !newDate || !type) throw new Error("Missing data: registerId, newDate o type");
    const registerUpdated = await FunctionUpdateDateofRegister(
      registerId,
      newDate,
      type
    );
    res.json(registerUpdated);
  } catch (error) {
    handleErrorHttp(res, 400, "UPDATE_INVENTORY", error)
  }
};

//* Funciones
//* Funcion para obtener los registros del invetario
const FunctionGetInventory = async (registerId:number | null) => {
  try {
    if (!registerId) {
      const inventory = await Inventory.findAll({
        include: {
          model: Product,
          as: "prod",
          attributes: ["name", "price", "category", "quantity"],
        },
      });
      return inventory;
    } else {
      const inventory = await Inventory.findByPk(registerId, {
        include: {
          model: Product,
          as: "prod",
          attributes: ["name", "price", "category", "quantity"],
        },
      });
      return inventory;
    }
  } catch (error) {
    return handleError("FUNCTION_GET_INVENTORY", error)
  }
};

//*Funcion para actulizar la fecha del registro de invetario
const FunctionUpdateDateofRegister = async (registerId:number, newDate:string, type:string) => {
  try {
    let registerUpdated = await Inventory.update(
      { [`${type}Date`]: newDate },
      { where: { id: registerId } }
    );
    return registerUpdated;
  } catch (error) {
    return handleError("FUNCTION_GET_INVENTORY", error)
  }
};

export {
  GetAllHistorialTheInventory,
  PostNewRegisterInTheInventory,
  UpdateDateOfRegisterForType,
};
