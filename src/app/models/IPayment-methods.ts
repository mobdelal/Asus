import { IBaseEntity } from "./IBase-entity";
import { ICardType } from "./ICard-type";

export interface IPaymentMethods extends IBaseEntity<number> {
  cardNumber: string;
  expirationDate: Date; 
  isDefault: boolean; 
  cardTypeId: number; 
  cardType: ICardType; 
}