import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-new-course-dialog',
  templateUrl: './new-course-dialog.component.html',
  styleUrls: ['./new-course-dialog.component.css']
})
export class NewCourseDialogComponent implements OnInit {

  id = new FormControl();
  name = new FormControl();

  error = false;

  constructor(private dialogRef: MatDialogRef<NewCourseDialogComponent>) { }

  ngOnInit(): void {
  }

  cancel() {
    this.dialogRef.close(false)
  }

  addCourse() {
    console.dir("NewCourseDialogComponent - addCourse() - TODO")
    // TODO - contact service then return the new course
    this.dialogRef.close({ id: this.id.value, name: this.name.value })
  }

}
