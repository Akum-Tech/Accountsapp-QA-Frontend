import { TestBed } from '@angular/core/testing';

import { EditviewPurchasevoucherService } from './editview-purchasevoucher.service';

describe('EditviewPurchasevoucherService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EditviewPurchasevoucherService = TestBed.get(EditviewPurchasevoucherService);
    expect(service).toBeTruthy();
  });
});
