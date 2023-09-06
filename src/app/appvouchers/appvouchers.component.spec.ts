import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppvouchersComponent } from './appvouchers.component';

describe('AppvouchersComponent', () => {
  let component: AppvouchersComponent;
  let fixture: ComponentFixture<AppvouchersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppvouchersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppvouchersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
