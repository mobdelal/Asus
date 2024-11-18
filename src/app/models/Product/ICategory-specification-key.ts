import { ICategory } from "../ICategory";
import { ISpecificationKey } from "../ISpecification-key";

export interface ICategorySpecificationKey {
    categoryId: number;
  category: ICategory; 
  specificationKeyId: number;
  specificationKey: ISpecificationKey; 
}
