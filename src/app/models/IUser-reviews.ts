import { IUser } from "./IUser";
import { IReviews } from "./IReviews";

export interface IUserReviews {
    id: number;                             
    userId: number;                     
    reviewId: number;                         
    user?: IUser;                          
    review?: IReviews;             
}
