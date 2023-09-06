import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintcreditnoteComponent } from './printcreditnote.component';

describe('PrintcreditnoteComponent', () => {
  let component: PrintcreditnoteComponent;
  let fixture: ComponentFixture<PrintcreditnoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintcreditnoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintcreditnoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
