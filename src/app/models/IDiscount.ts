import { IBaseEntity } from './IBase-entity';
import { IProductDiscount } from './Product/IProduct-discount';

export interface IDiscount extends IBaseEntity<number> {
  name: string;
  name_EN: string;
  code: number;
  imageUrl:string;
  startDate: Date; 
  endDate: Date;
  active: boolean;
  percentage: number; 
  productDiscounts?: IProductDiscount[];
}