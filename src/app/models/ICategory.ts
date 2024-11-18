import { IProductCategory } from "./Product/IProduct-category";
import { ICategorySpecificationKey } from "./Product/ICategory-specification-key";

export interface ICategory {
  id: number;
  name: string;
  name_EN: string;
  imageUrl:string;
  parentCategoryID?: number;
  parentCategory?: ICategory; 
  subCategories?: ICategory[]; 
  code: number;
  product_Category?: IProductCategory[]; 
  categorySpecificationKeys?: ICategorySpecificationKey[];
}
