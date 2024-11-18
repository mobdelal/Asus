import { Component, HostListener, OnDestroy } from '@angular/core';
import { MainDivComponent } from "../main-div/main-div/main-div.component";
import { ImageGridComponent } from "../image-grid/image-grid.component";
import { ProductsService } from '../../../services/product/products.service';
import { IProduct } from '../../models/Product/IProduct';
import { ProductSliderComponent } from "../product-slider/product-slider.component";
import { TranslateModule } from '@ngx-translate/core';
import { CampaignsComponent } from '../campaigns/campaigns.component';
import { CommonModule, NgIf } from '@angular/common';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MainDivComponent, ImageGridComponent, NgIf,ProductSliderComponent,TranslateModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent  implements OnDestroy{
  products: IProduct[] = [];
  showScrollTopButton: boolean = true;
  private productSubscription: Subscription | undefined;


  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (window.scrollY > 100) {
      this.showScrollTopButton = true;
    } else {
      this.showScrollTopButton = true;
    }
  }

  constructor(private productService: ProductsService) {}

  ngOnDestroy(): void {
    this.productSubscription?.unsubscribe();
  }
  ngOnInit(): void {
    this.loadBestDeals();
  }

  loadBestDeals(): void {
    this.productSubscription = this.productService.getBestDeals().subscribe((bestDeals: IProduct[]) => {
      this.products = bestDeals;
      console.log('Best Deals:', this.products);
    }, (error) => {
      console.error('Error fetching best deals:', error);
    });
  }

  scrollSlider(direction: 'prev' | 'next'): void {
    const slider = document.querySelector('.slider-container') as HTMLElement;
    const scrollAmount = 300;

    if (direction === 'prev') {
      slider.scrollLeft -= scrollAmount;
    } else if (direction === 'next') {
      slider.scrollLeft += scrollAmount;
    }
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}