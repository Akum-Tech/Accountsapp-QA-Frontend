import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppSaleRegisterComponent } from './app-sale-register.component';

describe('AppSaleRegisterComponent', () => {
  let component: AppSaleRegisterComponent;
  let fixture: ComponentFixture<AppSaleRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppSaleRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppSaleRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
