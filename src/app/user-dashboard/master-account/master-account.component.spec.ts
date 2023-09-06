import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterAccountComponent } from './master-account.component';

describe('MasterAccountComponent', () => {
  let component: MasterAccountComponent;
  let fixture: ComponentFixture<MasterAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
