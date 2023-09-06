import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatepaymentComponent } from './createpayment.component';

describe('CreatepaymentComponent', () => {
  let component: CreatepaymentComponent;
  let fixture: ComponentFixture<CreatepaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatepaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatepaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
