import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { IOrder } from '../../app/models/Order/IOrder';
import { IOrderCreate } from '../../app/models/Order/iorder-create';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  public cancelTimeout: any; 
  private _orderTotal: number = 0;
  orderId: number = 0


  constructor(private httpClient:HttpClient) { }


  getallorders():Observable<IOrder[]>{

    return  this.httpClient.get<IOrder[]>(`${environment.AsusUrl}/Order`)
  }
  
  createOrder(orderData: IOrderCreate): Observable<IOrder> {
    const token = sessionStorage.getItem('authToken');  
    console.log(token);
    

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // Send the request with headers
    console.log(headers);
    return this.httpClient.post<IOrder>(`${environment.AsusUrl}/Order`, orderData, { headers });
    
  }

  getOrdersByUserId(userId: number): Observable<IOrder[]> {
    return this.httpClient.get<IOrder[]>(`${environment.AsusUrl}/Order/user/${userId}`);
  }
  
  //to delete the order if not payed after 30 minutes
  cancelOrder(orderId: number): Observable<void> {
    return this.httpClient.delete<void>(`${environment.AsusUrl}/Order/${orderId}`);
  }
  
  setOrderTotal(total: number): void {
    this._orderTotal = total;
  }

  getOrderTotal(): number {
    return this._orderTotal;
  }
  updateOrderState(orderId: number): Observable<void> {
    return this.httpClient.get<void>(`${environment.AsusUrl}/Order/UpdateOrderState?orderId=${orderId}`);
  }
  
  setOrderId(orderId: number): void {
    this.orderId = orderId;
  }
  getOrderId(): number | null {
    return this.orderId;
  }
}
