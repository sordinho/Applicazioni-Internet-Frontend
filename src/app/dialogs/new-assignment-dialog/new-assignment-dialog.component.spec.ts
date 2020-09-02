import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAssignmentDialogComponent } from './new-assignment-dialog.component';

describe('NewAssignmentDialogComponent', () => {
  let component: NewAssignmentDialogComponent;
  let fixture: ComponentFixture<NewAssignmentDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewAssignmentDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewAssignmentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
