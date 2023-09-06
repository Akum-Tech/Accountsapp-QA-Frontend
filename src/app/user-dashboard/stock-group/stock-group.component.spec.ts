import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockGroupComponent } from './stock-group.component';

describe('StockGroupComponent', () => {
  let component: StockGroupComponent;
  let fixture: ComponentFixture<StockGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
