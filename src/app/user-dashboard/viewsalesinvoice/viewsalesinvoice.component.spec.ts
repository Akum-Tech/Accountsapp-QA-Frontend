import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewsalesinvoiceComponent } from './viewsalesinvoice.component';

describe('ViewsalesinvoiceComponent', () => {
  let component: ViewsalesinvoiceComponent;
  let fixture: ComponentFixture<ViewsalesinvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewsalesinvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewsalesinvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
