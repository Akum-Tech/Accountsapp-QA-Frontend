import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppReceiptprintComponent } from './app-receiptprint.component';

describe('AppReceiptprintComponent', () => {
  let component: AppReceiptprintComponent;
  let fixture: ComponentFixture<AppReceiptprintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppReceiptprintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppReceiptprintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
