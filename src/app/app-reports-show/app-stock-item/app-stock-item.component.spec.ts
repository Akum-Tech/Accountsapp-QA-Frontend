import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppStockItemComponent } from './app-stock-item.component';

describe('AppStockItemComponent', () => {
  let component: AppStockItemComponent;
  let fixture: ComponentFixture<AppStockItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppStockItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppStockItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
