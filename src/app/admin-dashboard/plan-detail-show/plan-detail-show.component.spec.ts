import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanDetailShowComponent } from './plan-detail-show.component';

describe('PlanDetailShowComponent', () => {
  let component: PlanDetailShowComponent;
  let fixture: ComponentFixture<PlanDetailShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanDetailShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanDetailShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
