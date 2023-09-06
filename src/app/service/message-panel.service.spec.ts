import { TestBed } from '@angular/core/testing';

import { MessagePanelService } from './message-panel.service';

describe('MessagePanelService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MessagePanelService = TestBed.get(MessagePanelService);
    expect(service).toBeTruthy();
  });
});
