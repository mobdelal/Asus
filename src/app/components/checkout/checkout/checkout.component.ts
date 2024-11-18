import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MiniNavComponent } from "../../mini-nav/mini-nav/mini-nav.component";
import { MiniFooterComponent } from "../../mini-footer/mini-footer/mini-footer.component";
import { Router, RouterLink } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { ProductsService } from '../../../../services/product/products.service';
import { IProduct } from '../../../models/Product/IProduct';
import { ShippingMethodService } from '../../../../services/ShippingMethod/shipping-method.service';
import { IShippingMethods } from '../../../models/IShipping-methods';
import { UserService } from '../../../../services/user/user.service';
import { IUser } from '../../../models/IUser';
import { OrdersService } from '../../../../services/order/orders.service';
import { IOrderCreate } from '../../../models/Order/iorder-create';
import { LanguageService } from '../../../../services/language/language.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ICreateOrderRequest, IPayPalConfig, NgxPayPalModule } from 'ngx-paypal';
 import { Modal } from 'bootstrap';
import { PaypalService } from '../../../../services/paypal/paypal.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [FormsModule,NgIf ,CommonModule, ReactiveFormsModule,MiniNavComponent, MiniFooterComponent ,TranslateModule, NgxPayPalModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutForm!: FormGroup;
  loading = false;
  cartItems: { product: IProduct; quantity: number }[] = [];
  cartSubtotal: number = 0;
  shippingMethods: IShippingMethods[] = [];
  shippingCost: number = 0;
  orderTotal: number = 0;
  CurrentUser: IUser = {} as IUser;
  formData = {};
  showDetails: boolean = false;
  formSubmitted = false;
  outOfStockItems: { name: string, requestedQuantity: number, availableQuantity: number }[] = [];
  lang:string ='';
  private modal!: Modal;



//paypal

totalAmount: number = 1;
public payPalConfig?: IPayPalConfig;
orderId?: number | null ;
 bootstrap: any;
@ViewChild('exampleModal') exampleModal!: ElementRef;

  constructor(
    private fb: FormBuilder, 
    private productService: ProductsService,
    private router: Router, 
    private shippingMethodService: ShippingMethodService,
    private userService: UserService,
    private ordersService: OrdersService,
    private _LanguageService:LanguageService ,private translate: TranslateService,
    private paypalService: PaypalService
  ) {}




  ngOnInit(): void {

    const modalElement = document.getElementById('exampleModal');
    if (modalElement) {
      this.modal = new Modal(modalElement); 
    }

    this.orderTotal = this.ordersService.getOrderTotal();
    this.orderId = this.ordersService.getOrderId(); 

    this.initConfig();
    console.log(this.orderTotal);

    this.checkoutForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      address: ['', Validators.required],
      governance: ['', Validators.required],
      city: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^01[0-9]{9}$/)]],
      shippingMethod: ['', Validators.required],
      // agreeTerms: [false, Validators.requiredTrue]
    });


    this.cartItems = this.productService.getCartItems();
    this.calculateCartSubtotal();

    // Fetch the available shipping methods
    this.shippingMethodService.getAllShippingMethods().subscribe({
      next: (methods: IShippingMethods[]) => {
        this.shippingMethods = methods;
      },
      error: (err) => console.error('Error fetching shipping methods', err)
    });

    const email = this.userService.getUserEmail();
    if (email) {
      this.userService.getUserByEmail(email).subscribe({
        next: (user: IUser) => this.populateUserData(user),
        error: (err) => console.error('Error fetching user data', err),
      });
    }
    this._LanguageService.getlanguage().subscribe({
      next:(lang)=>{
        this.lang=lang;
      }
    })
   
  }

  populateUserData(user: IUser): void {
    this.CurrentUser = user; 
    this.checkoutForm.patchValue({
      firstName: user.firstName,
      lastName: user.lastName,
      governance: user.city,
      city: user.region,
    });
  }
  onShippingMethodChange(name: string): void {
    console.log(name);
    console.log(this.shippingMethods);

    const selectedMethod = this.shippingMethods.find(method => method.method_Name === name);
    console.log(selectedMethod);
    
    
    this.shippingCost = selectedMethod ? selectedMethod.cost : 0;
    this.calculateOrderTotal();
  }


  async onSubmit() {
    // Wait for the stock check to complete before continuing
    await this.checkStockBeforePlaceOrder();
  
    // If there are out-of-stock items, stop the form submission
    if (this.outOfStockItems.length > 0) {
      console.log('Some products are out of stock:', this.outOfStockItems);
      return; 
    }
  
    // If the form is valid and there are no out-of-stock items, proceed
    if (this.checkoutForm.valid) {
      this.formData = this.checkoutForm.value;  
      this.showDetails = true;  
      this.formSubmitted = true;
    } else {
      // If the form is invalid, mark all fields as touched to show validation errors
      this.checkoutForm.markAllAsTouched();
    }
  }
  
  checkStockBeforePlaceOrder(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Reset the out-of-stock items array before checking stock
      this.outOfStockItems = [];
  
      // Check if there are items in the cart
      if (!this.cartItems || this.cartItems.length === 0) {
        console.error('No items in the cart');
        resolve(); // Resolve immediately if no items
        return;
      }
  
      // Initiate stock checks for all items in the cart
      const stockChecks = this.cartItems.map(item =>
        this.productService.checkProductStock(item.product.id).toPromise()
      );
  
      // Wait for all stock checks to complete
      Promise.all(stockChecks)
        .then(stockResults => {
          // Identify out-of-stock items by comparing stock quantities
          const insufficientStockItems = this.cartItems.filter((item, index) => {
            const result = stockResults[index];
            return result && result.unitsInStock < item.quantity;
          });
  
          if (insufficientStockItems.length > 0) {
            // If there are insufficient stock items, add them to the out-of-stock array
            this.outOfStockItems = insufficientStockItems.map(item => ({
              name: item.product.name,
              requestedQuantity: item.quantity,
              availableQuantity: stockResults[this.cartItems.indexOf(item)]?.unitsInStock ?? 0
            }));
          } else {
            // If stock is sufficient, outOfStockItems array will remain empty
            this.outOfStockItems = [];
          }
  
          resolve(); // Resolve after stock check is complete
        })
        .catch(err => {
          console.error('Error checking stock for products', err);
          reject(err); // Reject if there's an error in stock checking
        });
    });
  }
  
  

  loadCartItems(): void {
    this.cartItems = this.productService.getCartItems();
  }

  calculateCartSubtotal(): void {
    this.cartSubtotal = this.cartItems.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);
  }

  calculateOrderTotal(): void {
    this.orderTotal = this.cartSubtotal + this.shippingCost;
  }
  
  removeFromCart(index: number): void {
    const item = this.cartItems[index];
    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      this.cartItems.splice(index, 1);
    }
    
    localStorage.setItem(this.productService.cartKey, JSON.stringify(this.cartItems));
  
    this.calculateCartSubtotal();
  }

  placeOrder(): void {
    if (!this.cartItems || this.cartItems.length === 0) {
        console.error('No items in the cart');
        return;
    }

    // Ensure that stock availability has been checked beforehand (using checkStockBeforePlaceOrder)
    if (this.outOfStockItems.length > 0) {
        console.log('Some products are out of stock:', this.outOfStockItems);
        return; // Exit and prevent order creation if items are out of stock
    }

    const userId = this.CurrentUser.id;
    const shippingMethodName = this.checkoutForm.get('shippingMethod')?.value;
    const selectedMethod = this.shippingMethods.find(method => method.method_Name === shippingMethodName);
    const shippingMethodId = selectedMethod ? selectedMethod.id : null;
    const phone = this.checkoutForm.get('phone')?.value.toString();
    const address = this.checkoutForm.get('address')?.value;

    if (userId && shippingMethodId) {
        const orderData: IOrderCreate = {
            UserId: userId,
            Products: this.cartItems.map(item => ({
                ProductId: item.product.id,
                Quantity: item.quantity,
                Price: item.product.price
            })),
            ShippingMethodId: shippingMethodId,
            TotalAmount: this.orderTotal,
            PhoneNumber: phone,
            Address: address,
        };
        console.log(orderData);

        this.ordersService.createOrder(orderData).subscribe({
            next: (response) => {
                console.log('Order created successfully:', response);
                this.orderId = response.id;
                this.ordersService.setOrderTotal(this.orderTotal);
                console.log(this.orderId);

                this.ordersService.setOrderId(this.orderId);

                this.ordersService.cancelTimeout = setTimeout(() => {
                    this.cancelOrder(this.orderId!);
                }, 30 * 60 * 1000);

                this.showModal();


            },
            error: (err) => console.error('Error placing order', err),
        });
    } else {
        console.error('User or shipping method is missing');
    }
}


  
  
  
  private initConfig(): void {
    this.payPalConfig = {
      currency: 'EUR',
      clientId: 'AV_7qzBjFtWINtu9Iu8kABwSUV3hJEW6E-eiLr6i6nVsv6Ar1Mki_lNDhWxYSHjKtF7ezr7cDXkmr83o', // Replace with your actual client ID for production
      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'EUR',
              value: this.orderTotal.toFixed(2),
              breakdown: {
                item_total: {
                  currency_code: 'EUR',
                  value: this.orderTotal.toFixed(2)
                }
              }
            },
            items: [
              {
                name: 'laptop',
                quantity: '1',
                category: 'DIGITAL_GOODS',
                unit_amount: {
                  currency_code: 'EUR',
                  value: this.orderTotal.toFixed(2),
                },
              }
            ]
          }
        ]
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical'
      },
      onApprove: (data, actions) => {
        console.log('onApprove - transaction was approved, but not authorized', data, actions);
        actions.order.get().then((details: any) => {
          console.log('onApprove - you can get full order details inside onApprove: ', details);
        });
      },
      onClientAuthorization: (data) => {
        console.log('onClientAuthorization - transaction completed', data);

        if (data.status === 'COMPLETED') {
          this.closeModal(); 

          this.showNotification('Transaction completed successfully!', 'success');
          this.productService.clearCart(); 
          console.log(this.orderId);
          if (this.ordersService.cancelTimeout) {
            clearTimeout(this.ordersService.cancelTimeout);
            console.log('Cancel timeout cleared');
          }
          
          if (this.orderId) {
            this.ordersService.updateOrderState(this.orderId).subscribe({
              next: () => {
                console.log('Order state updated successfully after payment.');
              },
              error: (err) => {
                console.error('Error updating order state:', err);
              }
            });
          } else {
            console.error('Order ID is missing.');
          }
          setTimeout(() => {
            this.router.navigate(['/home'], { replaceUrl: true }).then(() => {
              window.location.href = '/home'; // Forces the reload after navigation
            });
          }, 1300);
          // setTimeout(() => {
          //   this.router.navigate(['/home'], { replaceUrl: true }).then(() => {
          //     location.reload(); 
          //   });
          // }, 1300);
        } else {
          this.showNotification('Failed to complete the transaction.', 'danger');
        }
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
        this.showNotification('Payment canceled by user.', 'danger');
      },
      onError: (err) => {
        console.log('OnError', err);
        this.showNotification('An error occurred during the transaction. Please try again later.', 'danger');
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
      },
    };
  }

  showNotification(message: string, type: string) {
    const notificationContainer = document.getElementById("notification-container");
    if (notificationContainer) {
      notificationContainer.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
          <strong>${message}</strong>
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      `;
    }
  }
  

  cancelOrder(orderId: number): void {
    this.ordersService.cancelOrder(orderId).subscribe({
      next: () => {
        console.log(`Order ID: ${orderId} has been canceled due to non-payment.`);
      },
      error: (err) => console.error('Error canceling order', err),
    });
  }
  closeModal(): void {
    const modalElement = document.getElementById('exampleModal');
    if (modalElement) {
      const modal = Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
        
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) {
          backdrop.remove();
        }
        
        // Ensure page is scrollable and interactive again

      }
    }
  
    // Navigate to home after the modal closes
    // setTimeout(() => {
    //   this.router.navigate(['/home']); 
    // }, 300);  // Give some time for the modal to close before redirecting
  }
  showModal(): void {
    if (this.modal) {
      this.modal.show(); // Show the modal using Bootstrap's show() method
    }
  }


  

}