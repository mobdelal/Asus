import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductsService } from '../../../services/product/products.service';
import { IProduct } from '../../models/Product/IProduct';
import { ActivatedRoute } from '@angular/router';
import { ProductCardComponent } from '../product-card/product-card.component';
import { SidBarFilterComponent } from "../sid-bar-filter/sid-bar-filter.component";
import { LanguageService } from '../../../services/language/language.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-filterd-product',
  standalone: true,
  imports: [ProductCardComponent, SidBarFilterComponent, CommonModule],
  templateUrl: './filterd-product.component.html',
  styleUrl: './filterd-product.component.css'
})

export class FilterdProductComponent implements OnInit, OnDestroy {
  
  products: IProduct[] = [];    
  categoryId!: number; 
  lang: string = '';
  private subscriptions: Subscription = new Subscription();

  constructor(
    private productService: ProductsService,
    private route: ActivatedRoute,
    private _LanguageService: LanguageService,
  ) {}

  ngOnInit(): void {
    const routeSubscription = this.route.paramMap.subscribe(params => {
      const subCategoryIdParam = params.get('subCategoryId'); 
      
      if (subCategoryIdParam) { 
        const subCategoryId = +subCategoryIdParam; 
        this.categoryId = subCategoryId;
        this.filterProductsBySubCategory(subCategoryId); 
      }
    });
    this.subscriptions.add(routeSubscription);

    const languageSubscription = this._LanguageService.getlanguage().subscribe({
      next: (lang) => {
        this.lang = lang;
      }
    });
    this.subscriptions.add(languageSubscription);
  }

  filterProductsBySubCategory(subCategoryId: number): void {
    this.products = [];
    const productSubscription = this.productService.getProductsByCategory(subCategoryId).subscribe({
      next: (products: IProduct[]) => {
        this.products = products; 
      }
    });
    this.subscriptions.add(productSubscription);
  }

  onFilteredProducts(products: IProduct[]): void {
    this.products = products;  
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe(); 
  }
}
