import { Component, Input, OnInit } from '@angular/core';
import { IProduct } from '../models/Product/IProduct';
import { ProductCardComponent } from "../components/product-card/product-card.component";
import { CommonModule } from '@angular/common';
import { ProductsService } from '../../services/product/products.service';

@Component({
  selector: 'app-searched',
  standalone: true,
  imports: [ProductCardComponent, CommonModule],
  templateUrl: './searched.component.html',
  styleUrls: ['./searched.component.css']
})
export class SearchedComponent implements OnInit {
  searchResults: IProduct[] = [];

  constructor(private productsService: ProductsService) {}

  ngOnInit(): void {
    this.productsService.searchResults$.subscribe(results => {
      this.searchResults = results; 
      console.log(this.searchResults);
      
    });
  }
}
