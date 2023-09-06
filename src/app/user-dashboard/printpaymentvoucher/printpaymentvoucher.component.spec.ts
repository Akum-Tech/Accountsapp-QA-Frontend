import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintpaymentvoucherComponent } from './printpaymentvoucher.component';

describe('PrintpaymentvoucherComponent', () => {
  let component: PrintpaymentvoucherComponent;
  let fixture: ComponentFixture<PrintpaymentvoucherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintpaymentvoucherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintpaymentvoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
