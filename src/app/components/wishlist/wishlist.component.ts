import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../../services/product/products.service';
import { IProduct } from '../../models/Product/IProduct';
import { Router } from '@angular/router';
import { CommonModule, NgClass, NgComponentOutlet } from '@angular/common';
// import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; 
import { TranslateModule } from '@ngx-translate/core';
// import { AppComponent } from '../../app.component';
// import { IUser } from '../../models/IUser';
// import { UserService } from '../../../services/user/user.service';
@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [  FormsModule, CommonModule , TranslateModule ],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css'
})
export class WishlistComponent implements OnInit {
  wishlistItems: IProduct[] = [];
  activeLink: string = 'wishlist';

  constructor(private productService: ProductsService, private router: Router) {}

  ngOnInit(): void {
    this.loadWishlistItems();
  }

  loadWishlistItems(): void {
    this.wishlistItems = this.productService.getWishListItems();
  }

  setActive(link: string): void {
    this.activeLink = link;
  }

  removeFromWishlist(product: IProduct): void {
    this.productService.removeFromWishList(product);
    this.loadWishlistItems();
  }

  goToProductDetails(productId: number): void {
    this.router.navigate(['/product-details', productId]);
  }
}
