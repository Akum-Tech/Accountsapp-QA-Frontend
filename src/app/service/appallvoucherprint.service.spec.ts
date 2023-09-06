import { TestBed } from '@angular/core/testing';

import { AppallvoucherprintService } from './appallvoucherprint.service';

describe('AppallvoucherprintService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AppallvoucherprintService = TestBed.get(AppallvoucherprintService);
    expect(service).toBeTruthy();
  });
});
