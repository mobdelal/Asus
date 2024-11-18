import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ISpecificationKey } from '../../app/models/ISpecification-key';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpecsService {

  constructor(private http: HttpClient) { }

  getSpecificationsByCategory(catId: number): Observable<ISpecificationKey[]> {
    return this.http.get<ISpecificationKey[]>(`${environment.AsusUrl}/Specifications/${catId}`);
  }
}
