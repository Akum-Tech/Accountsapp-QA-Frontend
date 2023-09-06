import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateStockinhandComponent } from './create-stockinhand.component';

describe('CreateStockinhandComponent', () => {
  let component: CreateStockinhandComponent;
  let fixture: ComponentFixture<CreateStockinhandComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateStockinhandComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateStockinhandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
