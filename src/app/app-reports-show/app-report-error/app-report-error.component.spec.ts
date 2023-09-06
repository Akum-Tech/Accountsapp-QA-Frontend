import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppReportErrorComponent } from './app-report-error.component';

describe('AppReportErrorComponent', () => {
  let component: AppReportErrorComponent;
  let fixture: ComponentFixture<AppReportErrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppReportErrorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppReportErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
