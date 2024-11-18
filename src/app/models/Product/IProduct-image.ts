import { IProduct } from "./IProduct";

export interface IProductImage {
    id: number;              
    imageUrl: string;         
    productId: number;         
    product?: IProduct;  
}
