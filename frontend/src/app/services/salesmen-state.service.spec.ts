import { TestBed } from '@angular/core/testing';

import { SalesmenStateService } from './salesmen-state.service';

describe('SalesmenStateService', () => {
  let service: SalesmenStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalesmenStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
