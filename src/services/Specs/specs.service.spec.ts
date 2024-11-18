import { TestBed } from '@angular/core/testing';

import { SpecsService } from './specs.service';

describe('SpecsService', () => {
  let service: SpecsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpecsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
