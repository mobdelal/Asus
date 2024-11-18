import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { IRegister } from '../../models/iregister';
import { HeaderComponent } from "../header/header.component";
import { UserService } from '../../../services/user/user.service';
import { Router, RouterLink } from '@angular/router';
import { MiniNavComponent } from "../mini-nav/mini-nav/mini-nav.component";
import { MiniFooterComponent } from "../mini-footer/mini-footer/mini-footer.component";
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../../services/language/language.service';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule,FormsModule,MiniNavComponent, MiniFooterComponent ,RouterLink,TranslateModule 
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {

  register:IRegister={} as IRegister
  yeer:string=''
  signUpForm: FormGroup ={} as FormGroup;
  selectedYear: string = 'Year';
  registrationError: string = "";
  currentLanguage: string = 'en';
  direction: string = 'ltr';


  

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private languageService: LanguageService, 
    private translate: TranslateService 
  ) {}

  ngOnInit(): void {
    this.signUpForm = this.fb.group({
      account: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, this.passwordStrengthValidator]],
      reEnterPassword: ['', Validators.required],
      dob: this.fb.group({
        year: [''],
        month: [''],
        day: ['']
      }),
      acceptTerms: [false, Validators.requiredTrue],
      //acceptCloudPolicy: [false],  
      //subscribeToASUSNews: [false],
      //subscribeToCloudNews: [false]
    }, { validators: this.passwordsMatchValidator });
    this.languageService.getlanguage().subscribe(language => {
      this.currentLanguage = language;
      this.translate.use(language);
      this.direction = language === 'ar' ? 'rtl' : 'ltr'; 

    });
  }

  onSubmit() {
    if (this.signUpForm.valid) {
      const formValue = this.signUpForm.value;
      const username = formValue.account.split('@')[0];
      const year = formValue.dob.year;
      const month = formValue.dob.month.toString().padStart(2, '0'); 
      const day = formValue.dob.day.toString().padStart(2, '0');    
      const birthDate = `${year}-${month}-${day}`;
  
      const registerData: IRegister = {
        Email: formValue.account,
        Username: username,
        Password: formValue.password,
        ConfirmPassword: formValue.reEnterPassword,
        birthDate: birthDate 
      };
      console.log(birthDate);
      
  
      this.userService.register(registerData).subscribe(
        response => {
          console.log('Registration successful:', response);
          this.userService.login({
            userNameOrEmail: registerData.Email,
            password: registerData.Password,
            rememberMe: true 
          }).subscribe(
            loginResponse => {
              console.log('Login successful:', loginResponse);
              this.router.navigate(['/profile']); 
            },
            loginError => {
              console.error('Auto-login failed:', loginError);
            }
          );
        },
        error => {
          console.error('Registration failed:', error);
          if (error.error && error.error.message === "User with the same email already exists") {
            this.registrationError = "User with the same email already exists";
          } else {
            this.registrationError = "Registration failed. Please try again.";
          }
        }
      );
    } else {
      console.log('Form is invalid. Please check the required fields.');
      this.signUpForm.markAllAsTouched();
    }
  }
  
  
  

  getYears() {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 100 }, (_, i) => currentYear - i);
  }
  
  getMonths() {
    return Array.from({ length: 12 }, (_, i) => i + 1);
  }
  
  getDays() {
    return Array.from({ length: 31 }, (_, i) => i + 1);
  }

  private passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
    const value: string = control.value || '';
    const hasUpperCase = /[A-Z]/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    if (!hasUpperCase || !hasSpecialChar) {
      return { passwordStrength: true };
    }

    return null;
  }
  private passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const reEnterPassword = group.get('reEnterPassword')?.value;
    return password && reEnterPassword && password === reEnterPassword ? null : { passwordsMismatch: true };
  }
}
