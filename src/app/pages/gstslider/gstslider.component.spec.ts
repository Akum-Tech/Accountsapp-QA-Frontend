import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GstsliderComponent } from './gstslider.component';

describe('GstsliderComponent', () => {
  let component: GstsliderComponent;
  let fixture: ComponentFixture<GstsliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GstsliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GstsliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
