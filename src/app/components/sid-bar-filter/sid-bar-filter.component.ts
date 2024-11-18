import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ISpecificationKey } from '../../models/ISpecification-key';
import { SpecsService } from '../../../services/Specs/specs.service';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../../../services/product/products.service';
import { IProduct } from '../../models/Product/IProduct';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { LanguageService } from '../../../services/language/language.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-sid-bar-filter',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './sid-bar-filter.component.html',
  styleUrls: ['./sid-bar-filter.component.css'],
  animations: [
    trigger('expandCollapse', [
      state('expanded', style({ height: '*', opacity: 1, overflow: 'hidden' })),
      state('collapsed', style({ height: '0px', opacity: 0, overflow: 'hidden' })),
      transition('expanded <=> collapsed', animate('300ms ease-in-out')),
    ]),
  ]
})
export class SidBarFilterComponent implements OnInit, OnChanges {
  specifications: ISpecificationKey[] = [];
  selectedValues: string[] = [];
  areAllSectionsExpanded = true;

  @Input() categoryId!: number; 
  openSections: { [key: number]: boolean } = {};
  @Output() filteredProducts = new EventEmitter<IProduct[]>();  
  lang: string = '';
  direction: string = 'ltr';

  private languageSubscription: Subscription | undefined;


  constructor(
    private specsService: SpecsService,
    private productsService: ProductsService,
    private languageService: LanguageService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.languageSubscription = this.languageService.getlanguage().subscribe(
      (lang) => {
        this.lang = lang;
        this.translate.use(lang); 
        this.direction = lang === 'ar' ? 'rtl' : 'ltr'; 
      }
    );
    this.loadSpecifications();

  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['categoryId'] && !changes['categoryId'].firstChange) {
      this.loadSpecifications();
    }
  }

  loadSpecifications(): void {
    this.specsService.getSpecificationsByCategory(this.categoryId).subscribe(
      (data) => {
        this.specifications = data;
        this.specifications.forEach(spec => {
          this.openSections[spec.id] = true;
        });
      },
      (error) => {
        console.error('Error fetching specifications:', error);
      }
    );
  }

  toggleSection(id: number): void {
    this.openSections[id] = !this.openSections[id];
  }

  onSpecificationValueChange(event: Event, value: string): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.selectedValues.push(value);
      console.log(this.selectedValues);
    } else {
      this.selectedValues = this.selectedValues.filter(v => v !== value);
    }
    this.fetchFilteredProducts();
  }
  
  fetchFilteredProducts(): void {
    if (this.selectedValues.length > 0) {
      this.productsService.getProductsBySpecificationValues(this.selectedValues).subscribe(
        (products: IProduct[]) => {
          this.filteredProducts.emit(products);
        },
        (error) => console.error('Error fetching products by specifications:', error)
      );
    } else {
      this.filteredProducts.emit([]);
    }
  }
  

  removeSelectedValue(value: string): void {
    this.selectedValues = this.selectedValues.filter(v => v !== value);
    this.fetchFilteredProducts();
    this.uncheckValue(value); // Uncheck the removed value
  }

  clearAllSelectedValues(): void {
    this.selectedValues = [];
    this.specifications.forEach(spec => {
      if (spec.values) {
        spec.values.forEach(value => this.uncheckValue(value));
      }
    });
    this.fetchFilteredProducts();
  }

  uncheckValue(value: string): void {
    const checkbox = document.querySelector(`input[type="checkbox"][id*="${value}"]`) as HTMLInputElement;
    if (checkbox) {
      checkbox.checked = false;
    }
  }

  toggleAllSections(): void {
    this.areAllSectionsExpanded = !this.areAllSectionsExpanded;
    Object.keys(this.openSections).forEach(id => {
      this.openSections[+id] = this.areAllSectionsExpanded;
    });
  }

  getSectionState(id: number): string {
    return this.openSections[id] ? 'expanded' : 'collapsed';
  }
  ngOnDestroy(): void {
    this.languageSubscription?.unsubscribe();
  }
}
