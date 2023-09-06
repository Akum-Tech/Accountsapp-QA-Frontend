import { TestBed } from '@angular/core/testing';

import { CreditnoteService } from './creditnote.service';

describe('CreditnoteService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CreditnoteService = TestBed.get(CreditnoteService);
    expect(service).toBeTruthy();
  });
});
