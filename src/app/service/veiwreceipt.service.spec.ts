import { TestBed } from '@angular/core/testing';

import { VeiwreceiptService } from './veiwreceipt.service';

describe('VeiwreceiptService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VeiwreceiptService = TestBed.get(VeiwreceiptService);
    expect(service).toBeTruthy();
  });
});
