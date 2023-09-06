import { TestBed } from '@angular/core/testing';

import { DebitnoteService } from './debitnote.service';

describe('DebitnoteService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DebitnoteService = TestBed.get(DebitnoteService);
    expect(service).toBeTruthy();
  });
});
