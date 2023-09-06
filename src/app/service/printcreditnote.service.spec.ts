import { TestBed } from '@angular/core/testing';

import { PrintcreditnoteService } from './printcreditnote.service';

describe('PrintcreditnoteService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PrintcreditnoteService = TestBed.get(PrintcreditnoteService);
    expect(service).toBeTruthy();
  });
});
