import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoLedgerListComponent } from './auto-ledger-list.component';

describe('AutoLedgerListComponent', () => {
  let component: AutoLedgerListComponent;
  let fixture: ComponentFixture<AutoLedgerListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutoLedgerListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoLedgerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
