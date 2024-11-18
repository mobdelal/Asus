import { Component, OnInit } from '@angular/core';
import { IProduct } from '../../models/Product/IProduct';
import { ProductsService } from '../../../services/product/products.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-product',
  standalone: true,
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  imports: [CommonModule],

})
export class ProductComponent implements OnInit {
  products: IProduct[] = [];  
  errorMessage: string = '';

  constructor(private productService: ProductsService) { }

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (products: IProduct[]) => {
        this.products = products;
      },
      error: (error) => {
        this.errorMessage = `Failed to load products: ${error.message}`;
      }
    });
  }
}
