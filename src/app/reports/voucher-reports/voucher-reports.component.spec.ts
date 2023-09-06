import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherReportsComponent } from './voucher-reports.component';

describe('VoucherReportsComponent', () => {
  let component: VoucherReportsComponent;
  let fixture: ComponentFixture<VoucherReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoucherReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoucherReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
