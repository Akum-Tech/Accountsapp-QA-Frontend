import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceplanetwoComponent } from './priceplanetwo.component';

describe('PriceplanetwoComponent', () => {
  let component: PriceplanetwoComponent;
  let fixture: ComponentFixture<PriceplanetwoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriceplanetwoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceplanetwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
