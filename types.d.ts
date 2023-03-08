export interface TProduct{
    id?: string;
    name: string;
    quantity:number;
    price:number;
    condition:string;
    category:string;
    unit:string;
}

export type NewProduct = Omit<TProduct, 'id'>

export  interface TInventory {
    id:string;
    quantity: number;
    entryDate:string;
    exitDate:string;
    destiny:string;
    storage:string;
    description:string;
    productId?:string
}
export interface TSale{
    id:number;
    quantity:number;
    total:number;
    createdAt:string;
    creationTime:string;
    productId?:number;
}

export type Operation = "substract" | "add" ;
//export type TSaleNotPrId = Optional<TSale, "productId">
//test