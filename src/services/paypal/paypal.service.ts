import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaypalService {

 
  constructor(private httpClient: HttpClient) {}


 

  createOrder(totalAmount: string): Observable<any> {
    const body = { totalAmount }; 
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' }); 
    
    return this.httpClient.post<any>(`${environment.AsusUrl}/Paypal`, body, { headers });
  }
  



  completeOrder(orderID: string): Observable<any> {
    const url = `${environment.AsusUrl}/CompleteOrder`; 
    const data = { orderID };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post(url, data, { headers });
  }
}
