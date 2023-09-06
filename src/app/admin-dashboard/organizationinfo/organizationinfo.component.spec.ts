import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationinfoComponent } from './organizationinfo.component';

describe('OrganizationinfoComponent', () => {
  let component: OrganizationinfoComponent;
  let fixture: ComponentFixture<OrganizationinfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganizationinfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
