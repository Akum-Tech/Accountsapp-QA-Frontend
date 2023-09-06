import { TestBed } from '@angular/core/testing';

import { SalesVoucherService } from './sales-voucher.service';

describe('SalesVoucherService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SalesVoucherService = TestBed.get(SalesVoucherService);
    expect(service).toBeTruthy();
  });
});
