import { IBaseEntity } from "../IBase-entity";
import { IProductImage } from "./IProduct-image";
import { IProductCategory } from "./IProduct-category";
import { IProductDiscount } from "./IProduct-discount";
import { IProductSpecification } from "./IProduct-specification";

export interface IProduct {
  map(arg0: (product: any) => any): IProduct;
  id: number;
  showFullSpecs: any;
  code: number; 
  name: string; 
  name_EN: string; 
  description?: string; 
  description_EN?: string; 
  image_url: string; 
  price: number; 
  length:number;
  unit_Instock: number;
  isActive: boolean; 
  imageURLs: string[]; 
  productCategory?: IProductCategory[]; 
  discounts?: string[]; 
  specifications?: IProductSpecification[];
  priceAfterDiscount: number;
}