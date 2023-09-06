import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatedebitnoteComponent } from './createdebitnote.component';

describe('CreatedebitnoteComponent', () => {
  let component: CreatedebitnoteComponent;
  let fixture: ComponentFixture<CreatedebitnoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatedebitnoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatedebitnoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
