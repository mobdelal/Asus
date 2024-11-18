import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ICreateOrderRequest, IPayPalConfig, NgxPayPalModule } from 'ngx-paypal';
import { PaypalService } from '../../../services/paypal/paypal.service';
import { OrdersService } from '../../../services/order/orders.service';
import { ProductsService } from '../../../services/product/products.service';

@Component({
  selector: 'app-paypal',
  standalone: true,
  imports: [RouterLink, CommonModule, NgxPayPalModule],
  templateUrl: './paypal.component.html',
  styleUrls: ['./paypal.component.css']
})
export class PaypalComponent implements OnInit {

  totalAmount: number = 1;
  public payPalConfig?: IPayPalConfig;
  orderTotal: number = 0;
  orderId?: number | null 

  constructor(private paypalService: PaypalService, private ordersService: OrdersService, private router:Router, private productService: ProductsService) {}

  ngOnInit(): void {
    this.orderTotal = this.ordersService.getOrderTotal();
    this.orderId = this.ordersService.getOrderId(); 

    this.initConfig();
    console.log(this.orderTotal);
  }

  // createPaypalOrder() {
  //   const totalAmount = this.ordersService.getOrderTotal().toFixed(2); // حدد القيمة المناسبة للمبلغ
  //   this.paypalService.createOrder(totalAmount).subscribe(
  //     (response) => {
  //       console.log('Order created successfully', response);
  //       if (response.Id) {
  //         // console.log(response.ID);
          

  //         window.location.href = `https://www.paypal.com/checkoutnow?token=${response.Id}`;
  //       }
  //     },
  //     (error) => {
  //       console.error('Error creating order', error);
  //     }
  //   );
  // }

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
          this.showNotification('Transaction completed successfully!', 'success');
          this.productService.clearCart(); 
          console.log(this.orderId);
          
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
            this.router.navigate(['/home']); 
          }, 1300); 
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
}