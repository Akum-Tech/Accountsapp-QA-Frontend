import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppCashBookComponent } from './app-cash-book.component';

describe('AppCashBookComponent', () => {
  let component: AppCashBookComponent;
  let fixture: ComponentFixture<AppCashBookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppCashBookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppCashBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
