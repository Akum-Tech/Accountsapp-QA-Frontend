import { TestBed } from '@angular/core/testing';

import { JournalvoucherService } from './journalvoucher.service';

describe('JournalvoucherService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: JournalvoucherService = TestBed.get(JournalvoucherService);
    expect(service).toBeTruthy();
  });
});
