import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDebitnoteComponent } from './edit-debitnote.component';

describe('EditDebitnoteComponent', () => {
  let component: EditDebitnoteComponent;
  let fixture: ComponentFixture<EditDebitnoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditDebitnoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDebitnoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
