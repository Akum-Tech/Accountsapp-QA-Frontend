import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppBankBookComponent } from './app-bank-book.component';

describe('AppBankBookComponent', () => {
  let component: AppBankBookComponent;
  let fixture: ComponentFixture<AppBankBookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppBankBookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppBankBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
