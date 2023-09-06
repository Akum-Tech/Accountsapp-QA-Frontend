import { TestBed } from '@angular/core/testing';

import { ViewSalesVoucherService } from './view-sales-voucher.service';

describe('ViewSalesVoucherService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ViewSalesVoucherService = TestBed.get(ViewSalesVoucherService);
    expect(service).toBeTruthy();
  });
});
