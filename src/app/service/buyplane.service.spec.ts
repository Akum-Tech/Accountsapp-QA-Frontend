import { TestBed } from '@angular/core/testing';

import { BuyplaneService } from './buyplane.service';

describe('BuyplaneService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BuyplaneService = TestBed.get(BuyplaneService);
    expect(service).toBeTruthy();
  });
});
