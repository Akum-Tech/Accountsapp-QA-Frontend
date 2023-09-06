import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceplanViewComponent } from './priceplan-view.component';

describe('PriceplanViewComponent', () => {
  let component: PriceplanViewComponent;
  let fixture: ComponentFixture<PriceplanViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriceplanViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceplanViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
