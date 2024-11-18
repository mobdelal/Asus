import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidBarFilterComponent } from './sid-bar-filter.component';

describe('SidBarFilterComponent', () => {
  let component: SidBarFilterComponent;
  let fixture: ComponentFixture<SidBarFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidBarFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidBarFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
