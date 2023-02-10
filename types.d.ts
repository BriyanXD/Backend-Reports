export interface TProduct{
    id?: number;
    name: string;
    quantity:number;
    price:number;
    condition:string;
    category:string;
    unit:string;
}

export type NewProduct = Omit<TProduct, 'id'>

export  interface TInventory {
    id:number;
    quantity: number;
    entryDate:string;
    exitDate:string;
    storage:string;
    description:string;
}
export interface TSale{
    id:number;
    quantity:number;
    total:number;
    createdAt:string;
    creationTime:string;
}

export type Operation = "substract" | "add" ;
//export type TSaleNotPrId = Optional<TSale, "productId">