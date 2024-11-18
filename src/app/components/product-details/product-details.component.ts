import { CommonModule } from '@angular/common';
import { Component, OnInit,NgModule, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../../../services/product/products.service';
import { IProduct } from '../../models/Product/IProduct';
import { StickyFooterComponent } from '../sticky-footer/sticky-footer.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../../services/language/language.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [StickyFooterComponent, CommonModule ,TranslateModule],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  product!: IProduct; 
  errorMessage: string = '';
  showFullSpecs: boolean = false;
  activeImage: string = 'assets/laptop1.png';
  private languageSubscription: Subscription | undefined;
  direction: string = 'ltr';
  lang: string = 'en';
  private subscriptions: Subscription[] = []; 


  constructor(
    private productService: ProductsService,
    private route: ActivatedRoute,
    private router: Router,
    private languageService: LanguageService,
    private translate: TranslateService,



  ) {}

  ngOnInit(): void {
    const languageSub = this.languageService.getlanguage().subscribe(
      (lang) => {
        this.lang = lang;
        this.translate.use(lang);
        this.direction = lang === 'ar' ? 'rtl' : 'ltr';
      }
    );
    this.subscriptions.push(languageSub); 

    const productId = Number(this.route.snapshot.paramMap.get('productId'));
    if (productId) {
      this.loadProductDetails(productId);
    }
  }
  
  loadProductDetails(productId: number): void {
    const productDetailsSub = this.productService.getProductById(productId).subscribe({
      next: (product) => {
        this.product = product;
        this.activeImage = product.imageURLs?.[0] || product.imageURLs?.[1] || this.activeImage;
        console.log("Product descriptionEN:", this.product.description_EN);
      },
      error: (err) => {
        this.errorMessage = 'Failed to load product details.';
        console.error(err);
      }
    });
    this.subscriptions.push(productDetailsSub); 
  }

  toggleSpecs(): void {
    this.showFullSpecs = !this.showFullSpecs;
  }

  scrollToSection(sectionId: string): void {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  }

  setActiveImage(imagePath: string): void {
    this.activeImage = imagePath;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
