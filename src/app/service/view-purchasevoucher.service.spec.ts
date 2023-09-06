import { TestBed } from '@angular/core/testing';

import { ViewPurchasevoucherService } from './view-purchasevoucher.service';

describe('ViewPurchasevoucherService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ViewPurchasevoucherService = TestBed.get(ViewPurchasevoucherService);
    expect(service).toBeTruthy();
  });
});
