import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GSTReportsComponent } from './gst-reports.component';

describe('GSTReportsComponent', () => {
  let component: GSTReportsComponent;
  let fixture: ComponentFixture<GSTReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GSTReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GSTReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
