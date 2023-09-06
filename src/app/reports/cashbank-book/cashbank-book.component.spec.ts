import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashbankBookComponent } from './cashbank-book.component';

describe('CashbankBookComponent', () => {
  let component: CashbankBookComponent;
  let fixture: ComponentFixture<CashbankBookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashbankBookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashbankBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
