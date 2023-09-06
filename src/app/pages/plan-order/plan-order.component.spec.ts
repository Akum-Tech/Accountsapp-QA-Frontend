import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanOrderComponent } from './plan-order.component';

describe('PlanOrderComponent', () => {
  let component: PlanOrderComponent;
  let fixture: ComponentFixture<PlanOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
