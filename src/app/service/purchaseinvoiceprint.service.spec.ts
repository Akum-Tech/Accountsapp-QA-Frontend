import { TestBed } from '@angular/core/testing';

import { PurchaseinvoiceprintService } from './purchaseinvoiceprint.service';

describe('PurchaseinvoiceprintService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PurchaseinvoiceprintService = TestBed.get(PurchaseinvoiceprintService);
    expect(service).toBeTruthy();
  });
});
