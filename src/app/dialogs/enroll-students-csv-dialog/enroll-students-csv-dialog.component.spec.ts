import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollStudentsCsvDialogComponent } from './enroll-students-csv-dialog.component';

describe('EnrollStudentsCsvDialogComponent', () => {
  let component: EnrollStudentsCsvDialogComponent;
  let fixture: ComponentFixture<EnrollStudentsCsvDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnrollStudentsCsvDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrollStudentsCsvDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
