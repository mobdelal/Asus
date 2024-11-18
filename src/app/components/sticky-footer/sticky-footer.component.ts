import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IProduct } from '../../models/Product/IProduct';
import { ProductsService } from '../../../services/product/products.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-sticky-footer',
  standalone: true,
  imports: [CommonModule,TranslateModule],
  templateUrl: './sticky-footer.component.html',
  styleUrls: ['./sticky-footer.component.css']
})
export class StickyFooterComponent implements OnInit {

  @Input() product!: IProduct;  
  favorite: boolean = false;

  constructor(private productService: ProductsService) {}

  ngOnInit() {
    this.favorite = this.productService.isInWishList(this.product);
    console.log(this.favorite);
    console.log(this.product);
    
  }
  

  toggleFavorite() {
    if (this.favorite) {
      this.productService.removeFromWishList(this.product);
      console.log(`${this.product.name} removed from wishlist`);
    } else {
      this.productService.addToWishList(this.product);
      console.log(`${this.product.name} added to wishlist`);
    }
    this.favorite = !this.favorite;
  }

  addToCart(product: IProduct) {
    this.productService.addToCart(product);
    console.log(`${product.name} has been added to the cart!`);
  }
}