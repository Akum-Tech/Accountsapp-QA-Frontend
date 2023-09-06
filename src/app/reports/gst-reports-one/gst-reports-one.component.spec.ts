import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GstReportsOneComponent } from './gst-reports-one.component';

describe('GstReportsOneComponent', () => {
  let component: GstReportsOneComponent;
  let fixture: ComponentFixture<GstReportsOneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GstReportsOneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GstReportsOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
