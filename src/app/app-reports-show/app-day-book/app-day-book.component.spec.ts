import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppDayBookComponent } from './app-day-book.component';

describe('AppDayBookComponent', () => {
  let component: AppDayBookComponent;
  let fixture: ComponentFixture<AppDayBookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppDayBookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppDayBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
