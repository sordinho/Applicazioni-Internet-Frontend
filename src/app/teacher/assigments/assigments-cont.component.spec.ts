import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssigmentsContComponent } from './assigments-cont.component';

describe('AssigmentsContComponent', () => {
  let component: AssigmentsContComponent;
  let fixture: ComponentFixture<AssigmentsContComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssigmentsContComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssigmentsContComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
