import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppPurhcasevoucherprintComponent } from './app-purhcasevoucherprint.component';

describe('AppPurhcasevoucherprintComponent', () => {
  let component: AppPurhcasevoucherprintComponent;
  let fixture: ComponentFixture<AppPurhcasevoucherprintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppPurhcasevoucherprintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppPurhcasevoucherprintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
