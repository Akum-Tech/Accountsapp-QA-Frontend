import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppStockReportComponent } from './app-stock-report.component';

describe('AppStockReportComponent', () => {
  let component: AppStockReportComponent;
  let fixture: ComponentFixture<AppStockReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppStockReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppStockReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
