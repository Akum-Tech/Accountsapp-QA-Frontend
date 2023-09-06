import { TestBed } from '@angular/core/testing';

import { PurchaseinvoiceService } from './purchaseinvoice.service';

describe('PurchaseinvoiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PurchaseinvoiceService = TestBed.get(PurchaseinvoiceService);
    expect(service).toBeTruthy();
  });
});
