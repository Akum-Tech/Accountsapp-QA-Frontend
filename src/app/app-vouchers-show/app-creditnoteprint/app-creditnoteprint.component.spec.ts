import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppCreditnoteprintComponent } from './app-creditnoteprint.component';

describe('AppCreditnoteprintComponent', () => {
  let component: AppCreditnoteprintComponent;
  let fixture: ComponentFixture<AppCreditnoteprintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppCreditnoteprintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppCreditnoteprintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
