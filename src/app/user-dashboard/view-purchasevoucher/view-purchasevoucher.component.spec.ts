import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPurchasevoucherComponent } from './view-purchasevoucher.component';

describe('ViewPurchasevoucherComponent', () => {
  let component: ViewPurchasevoucherComponent;
  let fixture: ComponentFixture<ViewPurchasevoucherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewPurchasevoucherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPurchasevoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
