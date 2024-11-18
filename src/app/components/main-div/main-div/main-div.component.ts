import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../../../services/product/products.service';
import { IProduct } from '../../../models/Product/IProduct';
import { Router } from '@angular/router';
import { UserService } from '../../../../services/user/user.service'; // Import the UserService
import { CommonModule } from '@angular/common';
import { IDiscount } from '../../../models/IDiscount';
import { DiscountService } from '../../../../services/discounts/discount.service';

@Component({
  selector: 'app-main-div',
  standalone: true,
  templateUrl: './main-div.component.html',
  styleUrls: ['./main-div.component.css'],
  providers: [ProductsService],
  imports:[CommonModule]
})
export class MainDivComponent implements OnInit {
  images: string[] = [];
  products: IProduct[] = [];
  isLoggedIn: boolean = false; 
  discounts: IDiscount[] = []; 
  discountedProducts: IProduct[] = [];



  constructor(
    private productService: ProductsService,
    private router: Router,
    private userService: UserService,
    private discountService: DiscountService, 

  ) {}

  ngOnInit(): void {
    this.loadSliderImages();
    this.isLoggedIn = this.userService.isLoggedIn();  
    this.loadDiscounts();
  }

  loadSliderImages(): void {
    this.productService.getSliderImages().subscribe((products: IProduct[]) => {
      this.products = products;
    });
  }

  openProductDetails(productId: number): void {
    this.router.navigate(['/product-details', productId]);
  }

  redirectToLogin(): void {
    this.router.navigate(['/sign-up']);  
  }
  loadDiscounts(): void {
    this.discountService.getDiscounts().subscribe((discounts: IDiscount[]) => {
      this.discounts = discounts;
      console.log(this.discounts);
      
    });
  }
  onDiscountImageClick(discountId: number): void {
    console.log('Navigating to discounted products with discountId:', discountId);
    
    this.router.navigate(['/discount', discountId]); 
  }
  
  
  
  
}
