import { IOrder } from "./Order/IOrder";
import { IPaymentMethods } from "./IPayment-methods";
import { IUserReviews } from "./IUser-reviews";

export interface IUser {
    id: number;
    userName:string;   
    firstName:string;
    lastName:string;                     
    birthDate?: string;                  
    city?: string;                     
    region?: string;
    password?: string;
    email?:string;
    postalCode?: string;
    country?: string;
    roles?: string[]; 
    orders?: IOrder[];                
    paymentMethodsID?: number;        
    paymentMethods?: IPaymentMethods; 
    userReviews?: IUserReviews[];
}
