import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { IProduct } from '../../app/models/Product/IProduct';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  public cartKey = 'userCart';
  private cartItemsSubject = new BehaviorSubject<{ product: IProduct, quantity: number }[]>(this.getCartItems());
  cartItems$ = this.cartItemsSubject.asObservable();
  public wishListKey = 'userWishlist';

  // private wishlistItemsSubject = new BehaviorSubject<IProduct[]>(this.getWishListItems());
  // wishlistItems$ = this.wishlistItemsSubject.asObservable();

  private searchResultsSubject = new BehaviorSubject<IProduct[]>([]);
  searchResults$ = this.searchResultsSubject.asObservable();
  private discountedProductsSubject = new BehaviorSubject<IProduct[]>([]);
  discountedProducts$ = this.discountedProductsSubject.asObservable();



  constructor(private httpClient: HttpClient) { }

  getAllProducts(): Observable<IProduct[]> {
    return this.httpClient.get<IProduct[]>(`${environment.AsusUrl}/Product`);
  }

  getProductsByCategory(categoryId: number): Observable<IProduct[]> {
    return this.httpClient.get<IProduct[]>(`${environment.AsusUrl}/Product/by-category/${categoryId}`);
  }

  getProductsBySpecificationValues(specificationValues: string[]): Observable<IProduct[]> {
    const params = new HttpParams({ fromObject: { specificationValues } });
    return this.httpClient.get<IProduct[]>(`${environment.AsusUrl}/Product/by-specification-values`, { params });
  }

  getProductById(id: number): Observable<IProduct> {
    return this.httpClient.get<IProduct>(`${environment.AsusUrl}/Product/${id}`);
  }

  addToCart(product: IProduct): void {
    const cart = this.getCartItems();
    const existingProduct = cart.find(item => item.product.id === product.id);

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.push({ product, quantity: 1 });
    }

    localStorage.setItem(this.cartKey, JSON.stringify(cart));
    this.cartItemsSubject.next(cart); 
  }

  getCartItems(): { product: IProduct, quantity: number }[] {
    return JSON.parse(localStorage.getItem(this.cartKey) || '[]');
  }

  clearCart(): void {
    localStorage.removeItem(this.cartKey);
    this.cartItemsSubject.next([]); 
  }
  getWishListItems(): IProduct[] {
    return JSON.parse(localStorage.getItem(this.wishListKey) || '[]');
  }

  addToWishList(product: IProduct): void {
    const wishList = this.getWishListItems();
    if (!wishList.some(item => item.id === product.id)) {
      wishList.push(product);
      localStorage.setItem(this.wishListKey, JSON.stringify(wishList));
    }
  }

  removeFromWishList(product: IProduct): void {
    const wishList = this.getWishListItems().filter(item => item.id !== product.id);
    localStorage.setItem(this.wishListKey, JSON.stringify(wishList));
  }

  isInWishList(product: IProduct): boolean {
    return this.getWishListItems().some(item => item.id === product.id);
  }

  checkProductStock(productId: number): Observable<{ productId: number, inStock: boolean, unitsInStock: number }> {
    return this.httpClient.get<{ productId: number, inStock: boolean, unitsInStock: number }>(`${environment.AsusUrl}/Product/check-stock/${productId}`);
  }

  searchProducts(term: string): Observable<IProduct[]> {
    const params = new HttpParams().set('id', term);
    return this.httpClient.get<IProduct[]>(`${environment.AsusUrl}/Product/search`, { params });
  }

  updateSearchResults(results: IProduct[]): void {
    this.searchResultsSubject.next(results);
  }
  getSliderImages(): Observable<IProduct[]> {
    return this.httpClient.get<IProduct[]>(`${environment.AsusUrl}/Product/Panner`);
  }
  getSliderImagesSmall(): Observable<IProduct[]> {
    return this.httpClient.get<IProduct[]>(`${environment.AsusUrl}/Product/images`);
  }
  getDiscountedProducts(discountId: number): Observable<IProduct[]> {
    const params = new HttpParams().set('DiscountId', discountId.toString());  
    return this.httpClient.get<IProduct[]>(`${environment.AsusUrl}/Product/With-discount-id`, { params });
  }
  setDiscountedProducts(results: IProduct[]): void {
    console.log('Setting discounted products:', results); 
    this.discountedProductsSubject.next(results);
    
  }
  getBestDeals(): Observable<IProduct[]> {
    return this.httpClient.get<IProduct[]>(`${environment.AsusUrl}/Product/best-Deals`);
  }


}