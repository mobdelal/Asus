import { ICategory } from "./ICategory";
import { IProductSpecification } from "./Product/IProduct-specification";
import { ICategorySpecificationKey } from "./Product/ICategory-specification-key";

export interface ISpecificationKey {
    id: number;                                  
    key: string;     
    key_Ar:string;                             
    categoryId?: number;                       
    category?: ICategory; 
    values?: string[];                   
    productSpecifications?: IProductSpecification[]; 
    categorySpecificationKeys?: ICategorySpecificationKey[];

}
