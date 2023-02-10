import { Request, Response } from "express";
import User from "../models/User";

const MostrarUsuario = async (_req:Request, res:Response) => {
  try {
    const allUsers = await User.findAll();
    res.send(allUsers);
  } catch (error) {
    res.status(400).send(error);
  }
};

export { MostrarUsuario };
