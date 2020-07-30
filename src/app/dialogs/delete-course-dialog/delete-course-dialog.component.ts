import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-delete-course-dialog',
  templateUrl: './delete-course-dialog.component.html',
  styleUrls: ['./delete-course-dialog.component.css']
})
export class DeleteCourseDialogComponent implements OnInit {

  id: FormControl
  name: FormControl

  error = false;

  constructor(private dialogRef: MatDialogRef<DeleteCourseDialogComponent>, @Inject(MAT_DIALOG_DATA) public course: any) {
    this.id = new FormControl(course.id);
    this.name = new FormControl(course.name);
  }

  ngOnInit(): void {}

  cancel() {
    this.dialogRef.close(false)
  }

  deleteCourse() {
    console.dir("DeleteCourseDialogComponent - deleteCourse() - TODO")
    // TODO - contact service then return true or false
    this.dialogRef.close(true)
  }

}
