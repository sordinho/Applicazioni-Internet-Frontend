import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssigmentsComponent } from './assigments.component';

describe('AssigmentsComponent', () => {
  let component: AssigmentsComponent;
  let fixture: ComponentFixture<AssigmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssigmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssigmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
