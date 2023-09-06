import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppPaymentprintComponent } from './app-paymentprint.component';

describe('AppPaymentprintComponent', () => {
  let component: AppPaymentprintComponent;
  let fixture: ComponentFixture<AppPaymentprintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppPaymentprintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppPaymentprintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
