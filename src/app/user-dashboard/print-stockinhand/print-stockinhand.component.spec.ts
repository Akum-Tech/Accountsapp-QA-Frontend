import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintStockinhandComponent } from './print-stockinhand.component';

describe('PrintStockinhandComponent', () => {
  let component: PrintStockinhandComponent;
  let fixture: ComponentFixture<PrintStockinhandComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintStockinhandComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintStockinhandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
