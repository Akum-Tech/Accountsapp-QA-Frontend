import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatejournalvoucherComponent } from './createjournalvoucher.component';

describe('CreatejournalvoucherComponent', () => {
  let component: CreatejournalvoucherComponent;
  let fixture: ComponentFixture<CreatejournalvoucherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatejournalvoucherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatejournalvoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
