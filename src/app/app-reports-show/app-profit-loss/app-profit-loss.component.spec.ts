import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppProfitLossComponent } from './app-profit-loss.component';

describe('AppProfitLossComponent', () => {
  let component: AppProfitLossComponent;
  let fixture: ComponentFixture<AppProfitLossComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppProfitLossComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppProfitLossComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
