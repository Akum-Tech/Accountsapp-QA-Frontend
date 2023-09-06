import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiplestockComponent } from './multiplestock.component';

describe('MultiplestockComponent', () => {
  let component: MultiplestockComponent;
  let fixture: ComponentFixture<MultiplestockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiplestockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiplestockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
