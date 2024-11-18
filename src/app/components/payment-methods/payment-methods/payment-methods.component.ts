import { Component, OnInit } from '@angular/core';
import { CheckOutService } from '../../../../services/check-out/check-out.service';
import { CommonModule } from '@angular/common';
import { MiniFooterComponent } from "../../mini-footer/mini-footer/mini-footer.component";
import { MiniNavComponent } from "../../mini-nav/mini-nav/mini-nav.component";

@Component({
  selector: 'app-payment-methods',
  standalone: true,
  imports: [CommonModule, MiniFooterComponent, MiniNavComponent],
  templateUrl: './payment-methods.component.html',
  styleUrl: './payment-methods.component.css'
})
export class PaymentMethodsComponent implements OnInit {

  formData: any 

  constructor(private checkoutDataService: CheckOutService) {}

  ngOnInit(): void {
    this.formData = this.checkoutDataService.getCheckoutData();
  }

}
