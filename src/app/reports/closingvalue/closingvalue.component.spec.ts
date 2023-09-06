import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClosingvalueComponent } from './closingvalue.component';

describe('ClosingvalueComponent', () => {
  let component: ClosingvalueComponent;
  let fixture: ComponentFixture<ClosingvalueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClosingvalueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClosingvalueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
