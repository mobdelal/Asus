import { CommonModule } from '@angular/common';
import { Component, OnInit, NgModule, Input } from '@angular/core';
import { ProductsService } from '../../../services/product/products.service';
import { IProduct } from '../../models/Product/IProduct';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule,TranslateModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})


export class ProductCardComponent {
  @Input() products!: IProduct[]; 
  errorMessage: string = '';
  showAllSpecs: boolean = false;




  constructor(private productService: ProductsService,private router: Router) { }
  
  

  toggleSpecsForAll(): void {
    this.showAllSpecs = !this.showAllSpecs; 
    this.products.forEach(product => {
      product.showFullSpecs = this.showAllSpecs;
    });
  }



  showFullSpecs: boolean = false;

  // Method to toggle the specs list


  toggleSpecs(productId: number): void {
    this.products = this.products.map(product =>
      product.id === productId ? { ...product, showFullSpecs: !product.showFullSpecs } : product
    );
  }

  // addToCart(product: IProduct) {
  //   this.productService.addToCart(product);
  //   console.log (`${product.name} has been added to the cart!`);

  // }
  viewProductDetails(productId: number): void {
    this.router.navigate(['/product-details', productId]);
  }
  addToCartAndCheckout(product: IProduct): void {
    this.productService.addToCart(product);
    this.router.navigate(['/checkout']);
  }

}