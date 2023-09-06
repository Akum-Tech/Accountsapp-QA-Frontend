import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountgroupReportComponent } from './accountgroup-report.component';

describe('AccountgroupReportComponent', () => {
  let component: AccountgroupReportComponent;
  let fixture: ComponentFixture<AccountgroupReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountgroupReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountgroupReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
