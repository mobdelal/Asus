import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { IProduct } from '../../models/Product/IProduct';
import { ProductsService } from '../../../services/product/products.service';
import { Router } from '@angular/router';
import { CategoriesService } from '../../../services/categories/categories.service';
import { ICategory } from '../../models/ICategory';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-image-grid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-grid.component.html',
  styleUrls: ['./image-grid.component.css'] 
})
export class ImageGridComponent implements OnInit, OnDestroy {

  sliderImages: IProduct[] = []; 
  categoriesWithImages: ICategory[] = [];
  private productSubscription: Subscription | undefined;
  private categorySubscription: Subscription | undefined;



  constructor(private productService: ProductsService, private router: Router, private categoriesService: CategoriesService) {}

  ngOnInit(): void {
    // this.loadSliderImages();
    this.loadCategoriesWithImages();

  }

  // loadSliderImages(): void {
  //   this.productSubscription = this.productService.getSliderImagesSmall().subscribe({
  //     next: (data: IProduct[]) => {
  //       this.sliderImages = data;  
  //     },
  //     error: (err) => {
  //       console.error('Error loading slider images', err);
  //     }
  //   });
  // }
  // openProductDetails(productId: number): void {
  //   this.router.navigate(['/product-details', productId]);
  // }
  loadCategoriesWithImages(): void {
    this.categorySubscription = this.categoriesService.getCategoriesWithImages().subscribe({
      next: (data: ICategory[]) => {
        this.categoriesWithImages = data;
        console.log(this.categoriesWithImages);  
      },
      error: (err) => {
        console.error('Error fetching categories with images', err);  
      }
    });
}
openCategory(subCategoryId: number): void {
  this.router.navigate(['/products', subCategoryId]);
}
ngOnDestroy() {
  //this.productSubscription?.unsubscribe();
  this.categorySubscription?.unsubscribe();
}
}
