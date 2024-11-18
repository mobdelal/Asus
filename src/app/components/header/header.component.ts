import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ProductsService } from '../../../services/product/products.service';
import { Route, Router } from '@angular/router';
import { IProduct } from '../../models/Product/IProduct';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  searchResults: IProduct[] = [];
  noResults = false;

constructor(private productService: ProductsService,private router: Router,
  ) {  }

performSearch(): void {
  const term = 'gaming';
      this.productService.searchProducts(term).subscribe(
        (results) => {
          this.productService.updateSearchResults(results);
          console.log(results);

          this.noResults = results.length === 0;

          if (results.length > 0) {
            this.router.navigate(['/search']);
          }
        },
        (error) => {
          console.error('Error fetching search results:', error);
        }
      );
  }

}
