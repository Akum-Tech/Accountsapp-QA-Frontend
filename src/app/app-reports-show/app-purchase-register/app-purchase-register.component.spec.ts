import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppPurchaseRegisterComponent } from './app-purchase-register.component';

describe('AppPurchaseRegisterComponent', () => {
  let component: AppPurchaseRegisterComponent;
  let fixture: ComponentFixture<AppPurchaseRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppPurchaseRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppPurchaseRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
