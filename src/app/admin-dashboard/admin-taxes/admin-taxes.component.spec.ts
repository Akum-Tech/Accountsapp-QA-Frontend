import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTaxesComponent } from './admin-taxes.component';

describe('AdminTaxesComponent', () => {
  let component: AdminTaxesComponent;
  let fixture: ComponentFixture<AdminTaxesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminTaxesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminTaxesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
