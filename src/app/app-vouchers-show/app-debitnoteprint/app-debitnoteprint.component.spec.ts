import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppDebitnoteprintComponent } from './app-debitnoteprint.component';

describe('AppDebitnoteprintComponent', () => {
  let component: AppDebitnoteprintComponent;
  let fixture: ComponentFixture<AppDebitnoteprintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppDebitnoteprintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppDebitnoteprintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
