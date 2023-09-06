import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockGroupReportComponent } from './stock-group-report.component';

describe('StockGroupReportComponent', () => {
  let component: StockGroupReportComponent;
  let fixture: ComponentFixture<StockGroupReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockGroupReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockGroupReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
