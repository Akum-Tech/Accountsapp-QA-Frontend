import { TestBed } from '@angular/core/testing';

import { AppReportsAllService } from './app-reports-all.service';

describe('AppReportsAllService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AppReportsAllService = TestBed.get(AppReportsAllService);
    expect(service).toBeTruthy();
  });
});
