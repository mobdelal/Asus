import { IBaseEntity } from "../IBase-entity";
import { IPaymentMethods } from "../IPayment-methods";
import { IShippingMethods } from "../IShipping-methods";
import { IOrderItems } from "./IOrder-items";
import { IUser } from "../IUser";
import { IOrderState } from "./IOrder-state";

export interface IOrder {
  id:number;
  code: number;
  orderDate: Date; 
  totalAmount: number; 
  trackingNumber?: string; 
  shippingAddress?: string; 
  orderItems?: IOrderItems[];
  shippingMethodsId: number;
  shippingMethods?: IShippingMethods; 
  shippingMethod: string; 
  shippingCost : number;
  paymentMethod:string;
  paymentMethodsId: number;
  paymentMethods?: IPaymentMethods;
  userId: number;
  user?: IUser; 
  orderStateId: number;
  orderState: string;
  orderStateArabic: string;
}