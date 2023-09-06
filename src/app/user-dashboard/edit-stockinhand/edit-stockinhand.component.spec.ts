import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditStockinhandComponent } from './edit-stockinhand.component';

describe('EditStockinhandComponent', () => {
  let component: EditStockinhandComponent;
  let fixture: ComponentFixture<EditStockinhandComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditStockinhandComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditStockinhandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
