import { TestBed } from '@angular/core/testing';

import { SubStockGroupService } from './sub-stock-group.service';

describe('SubStockGroupService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SubStockGroupService = TestBed.get(SubStockGroupService);
    expect(service).toBeTruthy();
  });
});
