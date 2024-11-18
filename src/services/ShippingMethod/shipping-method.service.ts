import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { IShippingMethods } from '../../app/models/IShipping-methods';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShippingMethodService {

  private apiUrl = `${environment.AsusUrl}/ShippingMethod`;

  constructor(private http: HttpClient) { }

  getAllShippingMethods(): Observable<IShippingMethods[]> {
    return this.http.get<IShippingMethods[]>(this.apiUrl);
  }
}
