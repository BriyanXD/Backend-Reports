import { Response } from "express"

//* Manejo de errores para consultas de la API
const handleErrorHttp = (res:Response, status:number, name:string, error?:any) => {
    console.log("\n"+name+"\n\n"+error+"\n")
    res.status(status).json({status,name,error})
}

//* Manejo de errores para servicios de las consultas
const handleError = (name:string, error?:any) => {
    console.log("\n"+name+"\n\n"+error+"\n")
    return error
}

export {handleErrorHttp, handleError};