import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppStockinhandvoucherComponent } from './app-stockinhandvoucher.component';

describe('AppStockinhandvoucherComponent', () => {
  let component: AppStockinhandvoucherComponent;
  let fixture: ComponentFixture<AppStockinhandvoucherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppStockinhandvoucherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppStockinhandvoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
