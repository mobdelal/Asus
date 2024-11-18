import { IDiscount } from "../IDiscount";
import { IProduct } from "./IProduct";

export interface IProductDiscount {
    id: number; 
    discountId: number; 
    productId: number; 
    discount?:IDiscount;    
    product?: IProduct; 
}
