import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GstReportsTwoComponent } from './gst-reports-two.component';

describe('GstReportsTwoComponent', () => {
  let component: GstReportsTwoComponent;
  let fixture: ComponentFixture<GstReportsTwoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GstReportsTwoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GstReportsTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
