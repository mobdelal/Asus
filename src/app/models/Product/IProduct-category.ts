import { ICategory } from "../ICategory";
import { IProduct } from "./IProduct";

export interface IProductCategory {
    id: number; 
    categoryId: number; 
    category?: ICategory; 
    productId: number; 
    product?: IProduct;
  }