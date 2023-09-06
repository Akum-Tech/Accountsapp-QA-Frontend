import { TestBed } from '@angular/core/testing';

import { BankDetailsService } from './bank-details.service';

describe('BankDetailsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BankDetailsService = TestBed.get(BankDetailsService);
    expect(service).toBeTruthy();
  });
});
