import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { IRegister } from '../../app/models/iregister';
import { ILogin } from '../../app/models/ilogin';
import { IUser } from '../../app/models/IUser';


@Injectable({
  providedIn: 'root'
})
export class UserService {
 
  private apiUrl = `${environment.AsusUrl}/Account`;
  private tokenKey = 'authToken';
  private userEmail: string | null = null; 

  userRegister:IRegister={} as IRegister;
  userLogin: ILogin={} as ILogin;
  private emailKey = 'userEmail';


  constructor(private httpClient: HttpClient) {}

  register(user: IRegister): Observable<any> {
    console.log("API URL:", this.apiUrl + '/register');
    console.log("Register data:", user); 
    this.userRegister=user;
    return this.httpClient.post(`${this.apiUrl}/register`, user);
  }


getUserDataregister(): IRegister{
  console.log(this.userRegister);
  return this.userRegister;
}

login(credentials: ILogin): Observable<any> {
  return this.httpClient.post(`${this.apiUrl}/login`, credentials).pipe(
    tap((response: any) => {
      if (response && response.token) {
        sessionStorage.setItem(this.tokenKey, response.token);
        const email = this.decodeToken(response.token);
        if (email) {
          sessionStorage.setItem(this.emailKey, email);
        }
      }
    })
  );
}

  getUserEmail(): string | null {
    return sessionStorage.getItem(this.emailKey);
  }

  getUserDatalog(): ILogin{
    console.log(this.userLogin);
    return this.userLogin;
  }


  

  getToken(): string | null {
    return sessionStorage.getItem('authToken');
  }

  logout(): void {
    sessionStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem(this.emailKey);
  }

  changePassword(email: string, oldPassword: string, newPassword: string): Observable<any> {
    const payload = { 
      Email: email, 
      OldPassword: oldPassword, 
      NewPassword: newPassword 
    };
    const url = `${this.apiUrl}/change-password`; 
    
    return this.httpClient.post(url, payload, {
      headers: {
        Authorization: `Bearer ${this.getToken()}`
      }
      
    });
  }
  updateUser(userDetails: IUser): Observable<IUser> {
    const url = `${this.apiUrl}/update`;
    return this.httpClient.patch<IUser>(url, userDetails);
  }

  getUserByEmail(email: string): Observable<IUser> {
    const url = `${this.apiUrl}/get-user-by-email/${email}`;
    return this.httpClient.get<IUser>(url);
  }
  
  private decodeToken(token: string): string | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.email || null; 
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
  
  isLoggedIn(): boolean {
    return !!this.getToken();  
  }

}
