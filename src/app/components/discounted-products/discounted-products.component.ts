import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductsService } from '../../../services/product/products.service';
import { IProduct } from '../../models/Product/IProduct';
import { ProductCardComponent } from "../product-card/product-card.component";
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-discounted-products',
  standalone: true,
  imports: [ProductCardComponent],
  templateUrl: './discounted-products.component.html',
  styleUrl: './discounted-products.component.css'
})
export class DiscountedProductsComponent implements OnInit, OnDestroy {
  
  discountedProducts: IProduct[] = [];
  discountId: number | null = null;
  private subscription: Subscription = new Subscription(); 

  constructor(
    private route: ActivatedRoute, 
    private productService: ProductsService
  ) {}

  ngOnInit(): void {
    this.discountId = +this.route.snapshot.paramMap.get('discountId')!;
    console.log('Discount ID from route:', this.discountId);

    if (this.discountId) {
      const discountSubscription = this.productService.getDiscountedProducts(this.discountId).subscribe(products => {
        this.discountedProducts = products;
        console.log('Discounted products fetched:', this.discountedProducts);
      });
      this.subscription.add(discountSubscription); 
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe(); 
  }
}