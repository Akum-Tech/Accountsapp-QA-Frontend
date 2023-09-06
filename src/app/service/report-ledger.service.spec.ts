import { TestBed } from '@angular/core/testing';

import { ReportLedgerService } from './report-ledger.service';

describe('ReportLedgerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReportLedgerService = TestBed.get(ReportLedgerService);
    expect(service).toBeTruthy();
  });
});
