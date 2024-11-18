import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterdProductComponent } from './filterd-product.component';

describe('FilterdProductComponent', () => {
  let component: FilterdProductComponent;
  let fixture: ComponentFixture<FilterdProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterdProductComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterdProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
