import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppBalanceSheetComponent } from './app-balance-sheet.component';

describe('AppBalanceSheetComponent', () => {
  let component: AppBalanceSheetComponent;
  let fixture: ComponentFixture<AppBalanceSheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppBalanceSheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppBalanceSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
