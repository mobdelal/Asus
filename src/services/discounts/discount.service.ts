import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'; 
import { IDiscount } from '../../app/models/IDiscount';

@Injectable({
  providedIn: 'root'
})
export class DiscountService {

  private baseUrl = `${environment.AsusUrl}/Discount`;

  constructor(private http: HttpClient) {}

  getDiscounts(): Observable<IDiscount[]> { 
    return this.http.get<IDiscount[]>(`${this.baseUrl}`);
  }
}
