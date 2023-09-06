import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockReportViewComponent } from './stock-report-view.component';

describe('StockReportViewComponent', () => {
  let component: StockReportViewComponent;
  let fixture: ComponentFixture<StockReportViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockReportViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockReportViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
