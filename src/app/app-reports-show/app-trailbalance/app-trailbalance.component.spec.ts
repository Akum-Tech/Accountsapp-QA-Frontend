import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppTrailbalanceComponent } from './app-trailbalance.component';

describe('AppTrailbalanceComponent', () => {
  let component: AppTrailbalanceComponent;
  let fixture: ComponentFixture<AppTrailbalanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppTrailbalanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppTrailbalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
