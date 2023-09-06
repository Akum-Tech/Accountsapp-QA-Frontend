import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanChangesComponent } from './plan-changes.component';

describe('PlanChangesComponent', () => {
  let component: PlanChangesComponent;
  let fixture: ComponentFixture<PlanChangesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanChangesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanChangesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
