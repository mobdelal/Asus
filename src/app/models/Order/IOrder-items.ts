import { IOrder } from "./IOrder";
import { IProduct } from "../Product/IProduct";

export interface IOrderItems {
    id: number; 
    quantity: number; 
    price: number;
    tax: number; 
    orderId: number; 
    order: IOrder; 
    productId: number; 
    product: IProduct;
}