import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankBookreportComponent } from './bank-bookreport.component';

describe('BankBookreportComponent', () => {
  let component: BankBookreportComponent;
  let fixture: ComponentFixture<BankBookreportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankBookreportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankBookreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
