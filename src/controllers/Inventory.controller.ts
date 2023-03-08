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
    const inventory = await FunctionGetInventory(String(registerId) || null);
    res.json(inventory);
  } catch (error) {
    handleErrorHttp(res, 400, "GET_INVENTORY", error)
  }
};

//*Crear nuevo registro en Inventario
const PostNewRegisterInTheInventory = async (req:Request, res:Response) => {
  const { exitDate, entryDate, productId, quantity } = req.body;
  try {
    if(entryDate === "" && exitDate === "") throw new Error("Missing data: exitDate or EntryDate")
    if(entryDate && exitDate) throw new Error("Select alone one data type: exitDate or EntryDate")
    let type:Operation = exitDate ? "substract" : "add"

    const element = await Inventory.create({...req.body, exitDate: exitDate || null , entryDate: entryDate || null});
    const newRegister = await FunctionGetInventory(String(element?.getDataValue("id")))
    await UpdateQuantityOfProduct(productId, quantity, type);
    res.json(newRegister);
  } catch (error) {
    handleErrorHttp(res, 400, "POST_INVENTORY", error)
  }
};

//*Actualizar la fecha de entrada o salida del invetario

const UpdateIventory = async(req:Request, res:Response) => {
  try {
    const { productId, quantity, id, exitDate } = req.body;
    const calculated = exitDate ? await calculateQuantityExit(id, quantity) : await calculateQuantityEntry(id, quantity)
    await Inventory.update(req.body,{where:{id:req.body.id}});
    const inventory = await FunctionGetInventory(req.body.id);
    await UpdateQuantityOfProduct(productId, calculated.result, calculated.type);
    res.json(inventory)
  } catch (error) {
    handleErrorHttp(res, 400, "UPDATE_INVENTORY", error)
  }
}

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

const DelelteInventory = async(req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await Inventory.findByPk(id);
    //! Esta condicion esta invertida al tener que usarse al momento de eliminar un registro
    let type:Operation = product?.getDataValue("exitDate") ? "add" : "substract";
    const inventory = await Inventory.destroy({where:{id}})
    await UpdateQuantityOfProduct(String(product?.getDataValue("productId")), Number(product?.getDataValue("quantity")), type);
    res.json(inventory);
  } catch (error) {
    handleErrorHttp(res, 400, "DELETE_INVENTORY", error)
  }
} 

//* Funciones
//* Funcion para obtener los registros del invetario
const FunctionGetInventory = async (registerId?:string | null) => {
  try {
    if (registerId === "undefined") {
      const inventory = await Inventory.findAll({
        include: {
          model: Product,
          as: "prod",
          attributes: ["name", "price", "category", "quantity"],
        },
      });
      return inventory;
    } else {
      const inventory = await Inventory.findByPk(String(registerId), {
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

const calculateQuantityEntry = async (id:string, currentQuantity:number) => {
  try {
    const sale = await Inventory.findByPk(id);
    if(!sale) return
    let previusQuantity = sale?.getDataValue("quantity");
    if(currentQuantity > previusQuantity) return {result:currentQuantity - previusQuantity, type:"add"}
    if(currentQuantity < previusQuantity) return {result:previusQuantity - currentQuantity, type:"substract"}
    return {result:currentQuantity, type: "otro"}
  } catch (error) {
    return handleError("CALCULATE_QUANTITY",error);
  }
}
const calculateQuantityExit = async (id:string, currentQuantity:number) => {
  try {
    const sale = await Inventory.findByPk(id);
    if(!sale) return
    let previusQuantity = sale?.getDataValue("quantity");
    if(currentQuantity > previusQuantity) return {result:currentQuantity - previusQuantity, type:"substract"}
    if(currentQuantity < previusQuantity) return {result:previusQuantity - currentQuantity, type:"add"}
    return {result:currentQuantity, type: "otro"}
  } catch (error) {
    return handleError("CALCULATE_QUANTITY",error);
  }
}
export {
  GetAllHistorialTheInventory,
  PostNewRegisterInTheInventory,
  UpdateDateOfRegisterForType,
  UpdateIventory,
  DelelteInventory
};
