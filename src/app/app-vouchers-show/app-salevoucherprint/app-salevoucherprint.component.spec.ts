import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppSalevoucherprintComponent } from './app-salevoucherprint.component';

describe('AppSalevoucherprintComponent', () => {
  let component: AppSalevoucherprintComponent;
  let fixture: ComponentFixture<AppSalevoucherprintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppSalevoucherprintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppSalevoucherprintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
