import { Component, OnInit } from '@angular/core';
import { MiniNavComponent } from "../../mini-nav/mini-nav/mini-nav.component";
import { MiniFooterComponent } from "../../mini-footer/mini-footer/mini-footer.component";
import { HeaderComponent } from "../../header/header.component";
import { NavbarComponent } from "../../navbar/navbar.component";
import { CommonModule } from '@angular/common';
import { UserService } from '../../../../services/user/user.service';
import { IRegister } from '../../../models/iregister';
import { StickyFooterComponent } from "../../sticky-footer/sticky-footer.component";
import { CheckoutComponent } from "../../checkout/checkout/checkout.component";
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IUser } from '../../../models/IUser';
import { OrdersService } from '../../../../services/order/orders.service';
import { IOrder } from '../../../models/Order/IOrder';
import { WishlistComponent } from '../../wishlist/wishlist.component';
import { ProductsService } from '../../../../services/product/products.service';
import { IProduct } from '../../../models/Product/IProduct';
import { IOrderItems } from '../../../models/Order/IOrder-items';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../../../services/language/language.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [
     
    CommonModule, 
    ReactiveFormsModule, WishlistComponent ,TranslateModule
  ],
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  currentUser: IRegister = {} as IRegister;
  LoggedUser: IUser = {} as IUser;
  selectedOption: string = 'profile';
  // selectedMenu: string = 'overview';
  changePasswordForm: FormGroup;
  personalform: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';
  showAccountSettingsOptions: boolean = false;
  years: number[] = [];
  months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  days: number[] = Array.from({ length: 31 }, (_, i) => i + 1); // 1 to 31
  orders: IOrder[] = [];
  selectedOrder: IOrder | null = null; 
  productDetails: { [key: number]: IProduct } = {}; 
  totalAmount: number = 0;
  totalShippingCost: number = 0;
  subTotal: number = 0;
  lang:string ='';
  activeSection: string = '';
  private subscriptions: Subscription[] = [];
  successChangeMessage: string = '';
  errorMessageChange: string = '';






  constructor(
    private userService: UserService, 
    private fb: FormBuilder, 
    private router: Router,
    private ordersService: OrdersService,
    private productService: ProductsService,
    private LanguageService:LanguageService, 
    private TranslateService:TranslateService,
    private route: ActivatedRoute,
    private _LanguageService:LanguageService ,private translate: TranslateService

  ) {
    this.changePasswordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6), this.passwordStrengthValidator]],
      confirmPassword: ['', Validators.required]
    });

    this.personalform = this.fb.group({
      firstName: [''],
      lastName: [''],
      nickName: [''],
      gender: [''],
      address: [''],
      city: [''],
      dob: this.fb.group({
        year: [''],
        month: [''],
        day: ['']
      })
    });    
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.route.fragment.subscribe((fragment) => {
        if (fragment) {
          this.selectedOption = fragment;
          if (fragment === 'orderStatus' || fragment === 'wishlist') {
            this.showAccountSettingsOptions = false; 
          }
        } else {
          this.selectedOption = 'profile'; 
          this.showAccountSettingsOptions = true;
        }
      })
    );

    const storedEmail = this.userService.getUserEmail();
    if (storedEmail) {
      this.subscriptions.push(
        this.userService.getUserByEmail(storedEmail).subscribe({
          next: (user) => {
            this.LoggedUser = user;
            console.log(this.LoggedUser);
            let year = '';
            let month = '';
            let day = '';
            this.personalform.patchValue({
              firstName: this.LoggedUser.firstName,
              lastName: this.LoggedUser.lastName,
              nickName: this.LoggedUser.userName,
              address: this.LoggedUser.region,
              city: this.LoggedUser.city,
              dob: {
                year,
                month,
                day
              }
            });
            this.fetchUserOrders(this.LoggedUser.id);
          },
          error: () => {
          }
        })
      );
    } else {
    }

    const currentYear = new Date().getFullYear();
    this.years = Array.from({ length: currentYear - 1899 }, (_, i) => 1900 + i);
    this.months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    this.days = Array.from({ length: 31 }, (_, i) => i + 1);

    this.subscriptions.push(
      this._LanguageService.getlanguage().subscribe({
        next: (lang) => {
          this.lang = lang;
        }
      })
    );
  }
  
  

  get oldPassword() { return this.changePasswordForm.get('oldPassword'); }
  get newPassword() { return this.changePasswordForm.get('newPassword'); }
  get confirmPassword() { return this.changePasswordForm.get('confirmPassword'); }

  selectMenu(menu: string) {
    this.showAccountSettingsOptions = false;
  }

  toggleAccountSettings() {
    this.showAccountSettingsOptions = !this.showAccountSettingsOptions;
  }

  selectOption(option: string) {
    this.selectedOption = option;
    this.selectMenu("");
    this.showAccountSettingsOptions = false;
  }
  selectSection(fragment: string) {
    this.activeSection = fragment;
    this.router.navigate([], { fragment: fragment });
  }

  onChangePassword(): void {
    if (this.changePasswordForm.invalid) {

      return;
    }
  
    const { oldPassword, newPassword, confirmPassword } = this.changePasswordForm.value;
    if (newPassword !== confirmPassword) {

      return;
    }
  
    if (!this.LoggedUser.email) {

      return;
    }
  
    const changePasswordSubscription = this.userService.changePassword(this.LoggedUser.email, oldPassword, newPassword).subscribe({
      next: (response) => {
        this.successMessage = response.Massage; 
        this.errorMessage = ""; 
        this.changePasswordForm.reset();
      },
      error: (error) => {
        console.log(error);
        this.errorMessage = error.error.Massage 
        this.successMessage = error.Massage; 
      }
    });
  
    this.subscriptions.push(changePasswordSubscription);
  
    const languageSubscription = this.LanguageService.getlanguage().subscribe({
      next: (lang) => {
        this.lang = lang;
      }
    });
  
    this.subscriptions.push(languageSubscription);
  }
  
  





  
  changeLang() {
    this.lang = (this.lang == 'en') ? 'ar' : 'en';
    this._LanguageService.changeLanguage(this.lang);
    this.translate.use(this.lang);
  }

  onSubmit() {
    if (this.personalform.valid) {
      const storedEmail = this.userService.getUserEmail();
      if (storedEmail) {
        const userSubscription = this.userService.getUserByEmail(storedEmail).subscribe({
          next: (user) => {
            const updatedUser: IUser = {
              id: user.id,
              firstName: this.personalform.get('firstName')?.value,
              lastName: this.personalform.get('lastName')?.value,
              userName: this.personalform.get('nickName')?.value,
              region: this.personalform.get('address')?.value,
              city: this.personalform.get('city')?.value,
              birthDate: this.createBirthDate(
                this.personalform.get('dob.year')?.value,
                this.personalform.get('dob.month')?.value,
                this.personalform.get('dob.day')?.value
              ),
            };
  
            const updateUserSubscription = this.userService.updateUser(updatedUser).subscribe({
              next: (updatedUserData) => {
                this.LoggedUser = updatedUserData;
                this.successMessage = "User data updated successfully!";
                this.errorMessage = "";

                this.router.navigateByUrl('/sign-up/profile', { skipLocationChange: true }).then(() => {
                  this.router.navigate([this.router.url]);
                });
              },
              error: () => {
                this.errorMessage = "Error updating user details.";
                this.successMessage = "";
              }
            });
  
            this.subscriptions.push(updateUserSubscription);
          },
          error: () => {
            this.errorMessage = "Error fetching user details.";
            this.successMessage = "";
          }
        });
  
        this.subscriptions.push(userSubscription);
      } else {
        this.errorMessage = "No email found for the current user.";
        this.successMessage = "";
      }
    } else {
      this.errorMessage = "Please fill out all required fields.";
      this.successMessage = "";
    }
  }
  
  
  private createBirthDate(year: string, month: string, day: string): string | undefined {
    if (year && month && day) {
      const monthPadded = month.padStart(2, '0');
      const dayPadded = day.padStart(2, '0');
      return `${year}-${monthPadded}-${dayPadded}`;
    }
    return undefined;
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

  fetchUserOrders(userId: number): void {
    const subscription = this.ordersService.getOrdersByUserId(userId).subscribe({
      next: (orders) => {
        this.orders = orders;
      },
      error: () => {
        
      }
    });
  
    this.subscriptions.push(subscription);
  }
  
  toggleDetails(order: IOrder) {
    if (this.selectedOrder === order) {
      this.selectedOrder = null;
      this.productDetails = {};
    } else {
      this.selectedOrder = order;
      this.fetchProductsForOrderItems(order.orderItems || []);
      this.calculateTotals(); 

    }
  }
  clearSelectedOrder() {
    this.selectedOrder = null;
    this.productDetails = {};
  }
  fetchProductsForOrderItems(orderItems: IOrderItems[]): void {
    const productIds = orderItems.map(item => item.id);
  
    productIds.forEach(id => {
      if (!this.productDetails[id]) { 
        const subscription = this.productService.getProductById(id).subscribe({
          next: (product) => {
            this.productDetails[id] = product;
            console.log(this.productDetails);
          },
          error: () => {
            console.error(`Error fetching product with ID: ${id}`);
          }
        });
  
        this.subscriptions.push(subscription);
      }
    });
  }
  
  calculateTotals() {
    if (this.selectedOrder && this.selectedOrder.orderItems) {
      this.totalAmount = this.selectedOrder.orderItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      this.totalShippingCost = this.selectedOrder.shippingCost || 0; 
      this.subTotal = this.totalAmount + this.totalShippingCost;
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}