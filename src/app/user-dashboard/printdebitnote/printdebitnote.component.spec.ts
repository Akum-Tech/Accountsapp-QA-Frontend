import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintdebitnoteComponent } from './printdebitnote.component';

describe('PrintdebitnoteComponent', () => {
  let component: PrintdebitnoteComponent;
  let fixture: ComponentFixture<PrintdebitnoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintdebitnoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintdebitnoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
