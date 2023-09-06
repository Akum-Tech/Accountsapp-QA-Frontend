import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppJournalvoucherComponent } from './app-journalvoucher.component';

describe('AppJournalvoucherComponent', () => {
  let component: AppJournalvoucherComponent;
  let fixture: ComponentFixture<AppJournalvoucherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppJournalvoucherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppJournalvoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
