import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-course-dialog',
  templateUrl: './new-course-dialog.component.html',
  styleUrls: ['./new-course-dialog.component.css']
})
export class NewCourseDialogComponent implements OnInit {

  id = new FormControl('', {
    updateOn: 'blur',
    validators: [Validators.required]
  });
  name = new FormControl('', {
    updateOn: 'blur',
    validators: [Validators.required]
  });
  
  error = false;

  constructor(private dialogRef: MatDialogRef<NewCourseDialogComponent>) { }

  ngOnInit(): void {
  }

  cancel() {
    this.dialogRef.close(false)
  }

  addCourse() {
    console.dir("NewCourseDialogComponent - addCourse() - TODO")
    if(!this.id.invalid && !this.name.invalid) { 
      // TODO - contact service then return the new course
      this.dialogRef.close({ id: this.id.value, name: this.name.value })
    } 

  }

  getIdErrorMessage() {
    if (this.id.hasError('required')) {
      return 'Id is required';
    } else {
      return '';
    }
  }

  getNameErrorMessage() {
    if (this.id.hasError('required')) {
      return 'Name is required';
    } else {
      return '';
    }
  }

}
