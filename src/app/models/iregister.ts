import { IPaymentMethods } from "./IPayment-methods";
import { IUserReviews } from "./IUser-reviews";
import { IOrder } from "./Order/IOrder";

export interface IRegister {


    // ID:string;
    Email: string;
    Username: string;
    Password: string;
    ConfirmPassword: string; 
    birthDate?: string
  
}
