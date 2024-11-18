import { IUserReviews } from "./IUser-reviews";
import { IProduct } from "./Product/IProduct";

export interface IReviews {
    id: number;                               
    accpted: number;                          
    rating: number;                           
    comment?: string;                        
    productId: number;                       
    userReviews?: IUserReviews[];              
    product: IProduct;                        
}
