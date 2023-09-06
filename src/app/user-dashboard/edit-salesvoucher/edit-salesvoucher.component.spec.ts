import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSalesvoucherComponent } from './edit-salesvoucher.component';

describe('EditSalesvoucherComponent', () => {
  let component: EditSalesvoucherComponent;
  let fixture: ComponentFixture<EditSalesvoucherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSalesvoucherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSalesvoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
