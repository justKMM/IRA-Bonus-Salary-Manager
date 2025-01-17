import { TestBed } from '@angular/core/testing';

import { BonusSalaryService } from './bonus-salary.service';

describe('BonusSalaryService', () => {
  let service: BonusSalaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BonusSalaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
