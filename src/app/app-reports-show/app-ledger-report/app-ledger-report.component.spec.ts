import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppLedgerReportComponent } from './app-ledger-report.component';

describe('AppLedgerReportComponent', () => {
  let component: AppLedgerReportComponent;
  let fixture: ComponentFixture<AppLedgerReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppLedgerReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppLedgerReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
