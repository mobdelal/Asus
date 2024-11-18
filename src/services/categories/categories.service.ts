import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'; 
import { ICategory } from '../../app/models/ICategory';


@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private httpClient:HttpClient) { }


  getSubCategoriesByParentName(parentCategoryName: string): Observable<ICategory[]> {
    const url = `${environment.AsusUrl}/Categoty/subcategories?parentCategoryName=${parentCategoryName}`;
    return this.httpClient.get<ICategory[]>(url);
}

getCategoriesWithImages(): Observable<ICategory[]> {
  const url = `${environment.AsusUrl}/Categoty/with-images`;
  return this.httpClient.get<ICategory[]>(url);
}
}
