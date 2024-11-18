import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, OnDestroy, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { LanguageService } from '../../../services/language/language.service';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CategoriesService } from '../../../services/categories/categories.service';
import { ICategory } from '../../models/ICategory';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { HeaderComponent } from "../header/header.component";
import { IProduct } from '../../models/Product/IProduct';
import { ProductsService } from '../../../services/product/products.service';
import { UserService } from '../../../services/user/user.service';
import { MyCustomDirectiveDirective } from '../../../Directives/my-custom-directive.directive';
import { Router, RouterLink } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [TranslateModule,NgbModule, NgFor, NgIf, HeaderComponent, RouterLink, CommonModule, MyCustomDirectiveDirective],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit, AfterViewInit, OnDestroy {
  lang: string = '';
  categorys: ICategory[] = [];
  subCategories: { [key: string]: ICategory[] } = {};
  dropdownOpen = false;
  isDropdownVisible: { [key: string]: boolean } = {};
  mouseOverDropdown: { [key: string]: boolean } = {};
  currentCategory: string | null = null;
  cartDropdownOpen = false;
  cartItems: { product: IProduct, quantity: number }[] = [];
  isUserSignedIn = false;
  @Output() outsideClick = new EventEmitter<void>();
  private closeTimeout: any;
  searchActive: boolean = false;
  @ViewChild('searchInput') searchInput: ElementRef | undefined;
  searchResults: IProduct[] = [];
  noResults = false;
  isMobile: boolean = false;
  isCollapsed! : boolean;
  isRtl: boolean = false;
  private languageSubscription: Subscription | undefined;
  private cartSubscription: Subscription | undefined;

  constructor(
    private _LanguageService: LanguageService,
    private translate: TranslateService,
    private router: Router,
    private _categoryService: CategoriesService,
    private productService: ProductsService,
    private userService: UserService,
    private elementRef: ElementRef,
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
    this.cartDropdownOpen = false;
  }

  changeLang() {
    this.lang = (this.lang == 'en') ? 'ar' : 'en';
    this.isRtl = this.lang === 'ar'; 

    this._LanguageService.changeLanguage(this.lang);
    this.translate.use(this.lang);
    document.documentElement.dir = this.isRtl ? 'rtl' : 'ltr'; 
  }

  @HostListener('window:resize')
  checkScreenSize() {
    this.isMobile = window.innerWidth <= 768; 
  }

  ngOnInit(): void {
    this.checkScreenSize();
    this.isCollapsed = true;
    this.checkUserSignedIn();
    this.languageSubscription = this._LanguageService.getlanguage().subscribe({
      next: (lang) => {
        this.lang = lang;
        this.isRtl = this.lang === 'ar';
        document.documentElement.dir = this.isRtl ? 'rtl' : 'ltr';
      }
    });

    this.cartSubscription = this.productService.cartItems$.subscribe(cartItems => {
      this.cartItems = cartItems;
    });
  }

  ngOnDestroy(): void {
    if (this.languageSubscription) {
      this.languageSubscription.unsubscribe();
    }
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  goToAbout() {
    window.location.href = '/login';
  }

  fetchSubCategories(parentCategoryName: string): void {
    clearTimeout(this.closeTimeout);
    this.currentCategory = parentCategoryName;
    Object.keys(this.isDropdownVisible).forEach(key => {
      this.isDropdownVisible[key] = key === parentCategoryName;
    });

    this._categoryService.getSubCategoriesByParentName(parentCategoryName).subscribe({
      next: (subcategories) => {
        this.subCategories[parentCategoryName] = subcategories;
        this.isDropdownVisible[parentCategoryName] = true;
      },
      error: (err) => console.error(`Error fetching subcategories: ${err.message}`)
    });
  }

  hideDropdown(parentCategoryName: string) {
    this.closeTimeout = setTimeout(() => {
      if (!this.mouseOverDropdown[parentCategoryName]) {
        this.isDropdownVisible[parentCategoryName] = false;
        this.currentCategory = null;
      }
    }, 200); 
  }

  toggleCategoryDropdown(parentCategoryName: string) {
    if (this.isMobile) {
      this.isDropdownVisible[parentCategoryName] = !this.isDropdownVisible[parentCategoryName];
      this.currentCategory = this.isDropdownVisible[parentCategoryName] ? parentCategoryName : null;
    }
  }

  setMouseOver(parentCategoryName: string, isOver: boolean) {
    this.mouseOverDropdown[parentCategoryName] = isOver;
    if (isOver) {
      clearTimeout(this.closeTimeout);
      this.isDropdownVisible[parentCategoryName] = true;
      this.currentCategory = parentCategoryName;
    } else {
      this.hideDropdown(parentCategoryName);
    }
  }

  filterProductsBySubCategory(subCategoryId: number): void {
    if (this.currentCategory) {
      this.isDropdownVisible[this.currentCategory] = false;
    }
    this.router.navigate(['/products', subCategoryId]);

  }

  toggleCartDropdown(): void {
    this.cartDropdownOpen = !this.cartDropdownOpen;
    this.dropdownOpen = false;
  }

  loadCartItems(): void {
    this.cartItems = this.productService.getCartItems();
  }

  getTotalPrice(): number {
    return this.cartItems.reduce((total, item) => {
      const price = item.product.priceAfterDiscount && item.product.priceAfterDiscount < item.product.price 
                    ? item.product.priceAfterDiscount 
                    : item.product.price;
      return total + price * item.quantity;
    }, 0);
  }

  checkUserSignedIn(): void {
    this.isUserSignedIn = !!sessionStorage.getItem('authToken');
  }

  logout(): void {
    this.userService.logout();
    this.isUserSignedIn = false;
    this.router.navigate(['/home']);
  }

  getTotalQuantity(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  removeFromCart(index: number): void {
    const item = this.cartItems[index];
    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      this.cartItems.splice(index, 1);
    }
    localStorage.setItem(this.productService.cartKey, JSON.stringify(this.cartItems));
  }

  toggleSearch() {
    this.searchActive = !this.searchActive;
    this.dropdownOpen = false;
  }

  ngAfterViewChecked() {
    if (this.searchActive && this.searchInput) {
      this.searchInput.nativeElement.focus();
    }
  }

  closeSearch(): void {
    this.searchActive = false; 
  }

  closeDropdown(): void {
    this.dropdownOpen = false;
  }

  closeCartDropdown(): void {
    this.cartDropdownOpen = false;
  }

  performSearch(term: string): void {
    if (term) {
      this.productService.searchProducts(term).subscribe(
        (results) => {
          this.productService.updateSearchResults(results);
          this.noResults = results.length === 0;
          this.searchActive = false;


          if (results.length > 0) {
            this.router.navigate(['/search']);
          }
        },
        (error) => {
          console.error('Error fetching search results:', error);
        }
      );
    } else {
      this.productService.updateSearchResults([]);
      this.noResults = false; 
    }
  }

  ngAfterViewInit(): void {
    this.updateDropdownPosition();
  }

  @HostListener('window:resize')
  onResize() {
    this.updateDropdownPosition();
  }

  private updateDropdownPosition(): void {
    const navbar = this.el.nativeElement.querySelector('.navbar');
    const dropdown = this.el.nativeElement.querySelector('.subcategory-dropdown');

    if (navbar && dropdown) {
      const navbarHeight = navbar.offsetHeight;
      this.renderer.setStyle(dropdown, 'top', `${navbarHeight}px`);
    }
  }
}