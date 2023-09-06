import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatecreditnoteComponent } from './createcreditnote.component';

describe('CreatecreditnoteComponent', () => {
  let component: CreatecreditnoteComponent;
  let fixture: ComponentFixture<CreatecreditnoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatecreditnoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatecreditnoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
