import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppreportsComponent } from './appreports.component';

describe('AppreportsComponent', () => {
  let component: AppreportsComponent;
  let fixture: ComponentFixture<AppreportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppreportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppreportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
