import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCreditnoteComponent } from './edit-creditnote.component';

describe('EditCreditnoteComponent', () => {
  let component: EditCreditnoteComponent;
  let fixture: ComponentFixture<EditCreditnoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCreditnoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCreditnoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
