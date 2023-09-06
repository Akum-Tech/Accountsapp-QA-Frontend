import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubaccountgroupComponent } from './subaccountgroup.component';

describe('SubaccountgroupComponent', () => {
  let component: SubaccountgroupComponent;
  let fixture: ComponentFixture<SubaccountgroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubaccountgroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubaccountgroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
