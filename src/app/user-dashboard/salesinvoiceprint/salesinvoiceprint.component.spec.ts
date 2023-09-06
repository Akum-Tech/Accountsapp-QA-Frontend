import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesinvoiceprintComponent } from './salesinvoiceprint.component';

describe('SalesinvoiceprintComponent', () => {
  let component: SalesinvoiceprintComponent;
  let fixture: ComponentFixture<SalesinvoiceprintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesinvoiceprintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesinvoiceprintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
