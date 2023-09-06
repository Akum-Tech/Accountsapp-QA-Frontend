import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceplanComponent } from './priceplan.component';

describe('PriceplanComponent', () => {
  let component: PriceplanComponent;
  let fixture: ComponentFixture<PriceplanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriceplanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceplanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
