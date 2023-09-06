import { TestBed } from '@angular/core/testing';

import { PaymentvoucherService } from './paymentvoucher.service';

describe('PaymentvoucherService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PaymentvoucherService = TestBed.get(PaymentvoucherService);
    expect(service).toBeTruthy();
  });
});
