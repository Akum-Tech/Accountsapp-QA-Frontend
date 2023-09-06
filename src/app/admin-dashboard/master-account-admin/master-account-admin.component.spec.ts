import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterAccountAdminComponent } from './master-account-admin.component';

describe('MasterAccountAdminComponent', () => {
  let component: MasterAccountAdminComponent;
  let fixture: ComponentFixture<MasterAccountAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterAccountAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterAccountAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
