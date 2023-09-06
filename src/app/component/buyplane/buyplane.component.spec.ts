import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyplaneComponent } from './buyplane.component';

describe('BuyplaneComponent', () => {
  let component: BuyplaneComponent;
  let fixture: ComponentFixture<BuyplaneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyplaneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyplaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
