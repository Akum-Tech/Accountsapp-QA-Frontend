import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersdetailAdminComponent } from './usersdetail-admin.component';

describe('UsersdetailAdminComponent', () => {
  let component: UsersdetailAdminComponent;
  let fixture: ComponentFixture<UsersdetailAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersdetailAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersdetailAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
