import { TestBed } from '@angular/core/testing';

import { AccountGroupService } from './account-group.service';

describe('AccountGroupService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AccountGroupService = TestBed.get(AccountGroupService);
    expect(service).toBeTruthy();
  });
});
