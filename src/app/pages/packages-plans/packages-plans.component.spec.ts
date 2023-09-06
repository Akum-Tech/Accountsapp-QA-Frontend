import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackagesPlansComponent } from './packages-plans.component';

describe('PackagesPlansComponent', () => {
  let component: PackagesPlansComponent;
  let fixture: ComponentFixture<PackagesPlansComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackagesPlansComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackagesPlansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
