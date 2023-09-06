import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintreceiptvoucherComponent } from './printreceiptvoucher.component';

describe('PrintreceiptvoucherComponent', () => {
  let component: PrintreceiptvoucherComponent;
  let fixture: ComponentFixture<PrintreceiptvoucherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintreceiptvoucherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintreceiptvoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
