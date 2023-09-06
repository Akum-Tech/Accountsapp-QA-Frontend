import { TestBed } from '@angular/core/testing';

import { StockReportsService } from './stock-reports.service';

describe('StockReportsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StockReportsService = TestBed.get(StockReportsService);
    expect(service).toBeTruthy();
  });
});
