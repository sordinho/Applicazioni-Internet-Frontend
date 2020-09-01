import { Component, OnInit, OnDestroy, EventEmitter, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { CourseService } from 'src/app/services/course.service';
import { Assignment } from 'src/app/models/assignment.model';

@Component({
  selector: 'app-new-assignment-dialog',
  templateUrl: './new-assignment-dialog.component.html',
  styleUrls: ['./new-assignment-dialog.component.css']
})
export class NewAssignmentDialogComponent implements OnInit {

  // date(dd/mm/yyyy) when exercise expired and the students can not upload an assignment
  expireDate = new FormControl(new Date())
  
  file: File

  error = false

  emitter: EventEmitter<void>

  courseId: string

  constructor(private dialogRef: MatDialogRef<NewAssignmentDialogComponent>, @Inject(MAT_DIALOG_DATA) public data, private courseService: CourseService) { 
    this.emitter = data.emitter
    this.courseId = data.courseId
  }

  ngOnInit() {}

  cancel() {
    this.dialogRef.close(false)
  }

  fileChange(event: any) {
    console.dir("fileChange - event: " + JSON.stringify(event))
    // when the load event is fired and the file not empty
    if(event.target.files && event.target.files.length > 0) {
      // Fill file variable with the file content
      this.file = event.target.files[0];
    }
  }

  addAssignment() {

    if (!this.expireDate.invalid) { 
      let today = new Date()
      const pickedDate = this.expireDate.value as Date
      if(today >= pickedDate) {
        this.expireDate.setErrors({'invalid': true})
        return
      }
      // all fields are valid
      this.courseService.addAssignment(this.courseId, this.expireDate.value, this.file)
            .subscribe(
              succ => {
                // console.dir("course " + createdCourse.id + " created successfully - owner: " + createdCourse.teacherId)
                this.emitter.emit()
                this.dialogRef.close()
              },
              err => {
                // console.dir("addCourse (error) - err: " + err)
                this.error = true   
              }
            )
    } else {
      this.expireDate.markAsTouched({onlySelf: true})
    }
  }

  getExpireDateErrorMessage() {
    if (this.expireDate.hasError('required')) {
      return 'Expire Date is required'
    } else if(this.expireDate.hasError('invalid')) {
      return 'Invalid Date: expire date is less or equals then today'
    } else {
      return ''
    }
  }

}
