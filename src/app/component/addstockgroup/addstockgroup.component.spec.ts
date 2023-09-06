import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddstockgroupComponent } from './addstockgroup.component';

describe('AddstockgroupComponent', () => {
  let component: AddstockgroupComponent;
  let fixture: ComponentFixture<AddstockgroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddstockgroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddstockgroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
