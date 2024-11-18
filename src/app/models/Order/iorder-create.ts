export interface IOrderCreate {
    UserId: number;
    Products: { ProductId: number; Price:number, Quantity: number }[];
    ShippingMethodId: number;
    TotalAmount: number;
    Address:string;
    PhoneNumber:string;
}
