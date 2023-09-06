import { TestBed } from '@angular/core/testing';

import { VeiwpaymentService } from './veiwpayment.service';

describe('VeiwpaymentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VeiwpaymentService = TestBed.get(VeiwpaymentService);
    expect(service).toBeTruthy();
  });
});
