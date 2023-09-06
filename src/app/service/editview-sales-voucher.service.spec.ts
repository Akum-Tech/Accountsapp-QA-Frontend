import { TestBed } from '@angular/core/testing';

import { EditviewSalesVoucherService } from './editview-sales-voucher.service';

describe('EditviewSalesVoucherService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EditviewSalesVoucherService = TestBed.get(EditviewSalesVoucherService);
    expect(service).toBeTruthy();
  });
});
