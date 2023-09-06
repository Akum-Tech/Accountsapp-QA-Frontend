import { TestBed } from '@angular/core/testing';

import { ViewjournalvoucherService } from './viewjournalvoucher.service';

describe('ViewjournalvoucherService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ViewjournalvoucherService = TestBed.get(ViewjournalvoucherService);
    expect(service).toBeTruthy();
  });
});
