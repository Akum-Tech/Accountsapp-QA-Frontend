import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppGroupReportsComponent } from './app-group-reports.component';

describe('AppGroupReportsComponent', () => {
  let component: AppGroupReportsComponent;
  let fixture: ComponentFixture<AppGroupReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppGroupReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppGroupReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
