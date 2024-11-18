import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../../../../services/user/user.service';
import { ILogin } from '../../../models/ilogin';
import { MiniNavComponent } from "../../mini-nav/mini-nav/mini-nav.component";
import { MiniFooterComponent } from "../../mini-footer/mini-footer/mini-footer.component";
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { LanguageService } from '../../../../services/language/language.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MiniNavComponent,
    MiniFooterComponent,
    TranslateModule 
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  
  user: ILogin = { userNameOrEmail: '', password: '', rememberMe: false };
  errorMessage: string | null = null;
  private languageSubscription: Subscription | undefined;
  private userSubscription: Subscription | undefined;
  direction: string = 'ltr';




  constructor(
    private userService: UserService,
    private router: Router,
    private translate: TranslateService,
    private languageService: LanguageService,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.languageSubscription = this.languageService.getlanguage().subscribe(lang => {
      this.translate.use(lang); 
      this.direction = lang === 'ar' ? 'rtl' : 'ltr'; 

    });
  }

  onSubmit(loginForm: NgForm) {
      this.userSubscription = this.userService.login(this.user).subscribe(
        response => {
          console.log('Login successful:', response);
          this.router.navigate(['/home']); 
        },
        error => {
          console.log('Login failed:', error);
          this.errorMessage = 'Invalid email or password'; 
        }
      );
  }

  ngOnDestroy() {
    this.languageSubscription?.unsubscribe();
    this.userSubscription?.unsubscribe();
  }

//   signInWithGoogle(): void {
//     const googleOAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${this.clientId}&redirect_uri=${this.redirectUri}&response_type=token&scope=openid%20profile%20email`;
//     window.location.href = googleOAuthUrl;
//   }
//   fetchUserData() {
//     if (this.token) {
//       this.http
//         .get('https://www.googleapis.com/oauth2/v3/userinfo', {
//           headers: {
//             Authorization: `Bearer ${this.token}`
//           }
//         })
//         .subscribe((user) => {
//           console.log("User Info:", user);
//           // Save user info as needed
//         });
//     }
// }
}