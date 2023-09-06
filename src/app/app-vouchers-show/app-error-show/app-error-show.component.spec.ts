import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppErrorShowComponent } from './app-error-show.component';

describe('AppErrorShowComponent', () => {
  let component: AppErrorShowComponent;
  let fixture: ComponentFixture<AppErrorShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppErrorShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppErrorShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
