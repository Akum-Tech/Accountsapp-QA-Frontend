import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseinvoiceprintComponent } from './purchaseinvoiceprint.component';

describe('PurchaseinvoiceprintComponent', () => {
  let component: PurchaseinvoiceprintComponent;
  let fixture: ComponentFixture<PurchaseinvoiceprintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseinvoiceprintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseinvoiceprintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
