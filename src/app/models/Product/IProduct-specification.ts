import { ISpecificationKey } from "../ISpecification-key";
import { IProduct } from "./IProduct";

export interface IProductSpecification {
    specificationKeyId: number;
  name?: string | null; 
  value: string;      
  name_AR:string;              
}
