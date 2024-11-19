import { CommonModule, NgFor } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IProduct } from '../../models/Product/IProduct';
import { ProductsService } from '../../../services/product/products.service';
import { Route, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-slider',
  standalone: true,
  imports: [FormsModule , TranslateModule , NgFor , CommonModule ],
  templateUrl: './product-slider.component.html',
  styleUrl: './product-slider.component.css'
})
export class ProductSliderComponent implements OnInit {


  @Input() products!: IProduct[]; 
  visibleProducts: IProduct[] = [];
  currentIndex = 0;
  itemsPerPage = 3;

  showAllSpecs: boolean = false;
  private productSubscription!: Subscription;



  constructor(private productService: ProductsService,
    private router: Router
  ){}




  ngOnInit(): void {
    this.loadBestDeals();
  }

  loadBestDeals(): void {
    
    console.log("=========================================");

    this.productSubscription = this.productService.getBestDeals().subscribe(
      
      (bestDeals: IProduct[]) => {
        console.log(bestDeals);
        console.log("=========================================");
        
        this.products = bestDeals;
        this.updateVisibleProducts();
      },
      (error) => {
        console.error('Error fetching best deals:', error);
      }
    );
  }

  
  next(): void {
    if (this.currentIndex + this.itemsPerPage < this.products.length) {
      this.currentIndex += this.itemsPerPage;
      this.updateVisibleProducts();
    }
  }
  
  prev(): void {
    if (this.currentIndex - this.itemsPerPage >= 0) {
      this.currentIndex -= this.itemsPerPage;
      this.updateVisibleProducts();
    }
  }
  
     updateVisibleProducts(): void {
      this.visibleProducts = this.products.slice(
        this.currentIndex,
        this.currentIndex + this.itemsPerPage
      );
    }


  viewProductDetails(productId: number): void {
    this.router.navigate(['/product-details', productId]);
  }

  addToCartAndCheckout(product: IProduct): void {
    this.productService.addToCart(product);
    this.router.navigate(['/checkout']);
  }





  toggleSpecsForAll(): void {
    this.showAllSpecs = !this.showAllSpecs; 
    this.products.forEach(product => {
      product.showFullSpecs = this.showAllSpecs;
    });
  }

  ngOnDestroy(): void {
    if (this.productSubscription) {
      this.productSubscription.unsubscribe();
    }
  }
 
}
