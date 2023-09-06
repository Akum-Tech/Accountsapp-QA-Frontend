import { TestBed } from '@angular/core/testing';

import { StockGroupService } from './stock-group.service';

describe('StockGroupService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StockGroupService = TestBed.get(StockGroupService);
    expect(service).toBeTruthy();
  });
});
