import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintjournalComponent } from './printjournal.component';

describe('PrintjournalComponent', () => {
  let component: PrintjournalComponent;
  let fixture: ComponentFixture<PrintjournalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintjournalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintjournalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
