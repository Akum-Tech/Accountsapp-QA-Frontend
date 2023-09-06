import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubStockGroupComponent } from './sub-stock-group.component';

describe('SubStockGroupComponent', () => {
  let component: SubStockGroupComponent;
  let fixture: ComponentFixture<SubStockGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubStockGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubStockGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
