import { TestBed } from '@angular/core/testing';

import { ReceiptvoucherService } from './receiptvoucher.service';

describe('ReceiptvoucherService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReceiptvoucherService = TestBed.get(ReceiptvoucherService);
    expect(service).toBeTruthy();
  });
});
