import { TestBed } from '@angular/core/testing';

import { AdminServicesService } from './admin-services.service';

describe('AdminServicesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdminServicesService = TestBed.get(AdminServicesService);
    expect(service).toBeTruthy();
  });
});
