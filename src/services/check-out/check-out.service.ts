import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckOutService {

  private checkoutData: any;

  setCheckoutData(data: any) {
    this.checkoutData = data;
  }

  getCheckoutData() {
    return this.checkoutData;
  }

  }