import { TestBed } from '@angular/core/testing';

import { ChangeuserdetailServiceService } from './changeuserdetail-service.service';

describe('ChangeuserdetailServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ChangeuserdetailServiceService = TestBed.get(ChangeuserdetailServiceService);
    expect(service).toBeTruthy();
  });
});
