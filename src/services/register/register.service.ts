import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private http: HttpClient)   
 {}

  googleLogin(): Observable<any> {
    // Send a request to your backend API to initiate Google OAuth flow
    return this.http.get(`${environment.AsusUrl}/register
      `);
  }


}
