import { TestBed } from '@angular/core/testing';

import { PrintdebitnoteService } from './printdebitnote.service';

describe('PrintdebitnoteService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PrintdebitnoteService = TestBed.get(PrintdebitnoteService);
    expect(service).toBeTruthy();
  });
});
