import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-edit-course-dialog',
  templateUrl: './edit-course-dialog.component.html',
  styleUrls: ['./edit-course-dialog.component.css']
})
export class EditCourseDialogComponent implements OnInit {
  id: FormControl
  name: FormControl

  error = false;

  constructor(private dialogRef: MatDialogRef<EditCourseDialogComponent>, @Inject(MAT_DIALOG_DATA) public course: any) { 
    this.id = new FormControl(course.id);
    this.name = new FormControl(course.name);
  }

  ngOnInit(): void {
  }

  cancel() {
    this.dialogRef.close()
  }

  editCourse() {
    console.dir("EditCourseDialogComponent - editCourse() - TODO")
    // TODO - contact service then return the edited course
    this.dialogRef.close({ id: this.id.value, name: this.name.value })
  }

}
