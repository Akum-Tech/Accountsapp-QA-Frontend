import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppJournalRegisterComponent } from './app-journal-register.component';

describe('AppJournalRegisterComponent', () => {
  let component: AppJournalRegisterComponent;
  let fixture: ComponentFixture<AppJournalRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppJournalRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppJournalRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
