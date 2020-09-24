import { Component, OnInit, Inject, EventEmitter } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { Course } from 'src/app/models/course.model';
import { CourseService } from 'src/app/services/course.service';
import { SnackbarMessage } from 'src/app/models/snackbarMessage.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-edit-course-dialog',
  templateUrl: './edit-course-dialog.component.html',
  styleUrls: ['./edit-course-dialog.component.css']
})
export class EditCourseDialogComponent implements OnInit {
  
  name: FormControl
  min: FormControl
  max: FormControl

  enabled = false

  course: Course
  emitter: EventEmitter<void>

  teacherId: string

  constructor(private dialogRef: MatDialogRef<EditCourseDialogComponent>, @Inject(MAT_DIALOG_DATA) public data, authService: AuthService, private courseService: CourseService, private snackBar: MatSnackBar) { 
    this.emitter = data.emitter
    this.course = data.course

    this.name = new FormControl(data.course.name, 
      {
        updateOn: 'blur',
        validators: [Validators.required]
      }
    )
  
    this.min = new FormControl(data.course.min, 
      {
        validators: [ Validators.required, Validators.pattern("^[0-9]*$") ]
      }
    )
  
    this.max = new FormControl(data.course.max, 
      {
        validators: [ Validators.required, Validators.pattern("^[0-9]*$") ]
      }
    )

    this.teacherId = authService.getUserId()
  }

  ngOnInit(): void {
  }

  getInitials(str: string) {
    var matches = str.match(/\b(\w)/g)
    if(matches !== null) return matches.join('')
    else return ''
  }

  cancel() {
    this.dialogRef.close()
  }

  editCourse() {
    if(this.min.value > this.max.value) {
      /* error in min and max values */
      this.max.setErrors({'invalid': true})
      this.min.setErrors({'invalid': true})
      return 
    } else {
      this.max.setErrors({'invalid': null})
      this.min.setErrors({'invalid': null})
      this.max.updateValueAndValidity()
      this.min.updateValueAndValidity()
    }

    if (!this.name.invalid && !this.min.invalid && !this.max.invalid) { 
      /* all fields are valid... */
      if(( this.course.name !== this.name.value || this.course.min !== this.min.value || this.course.max !== this.max.value || this.enabled)) {
        // at least one value has changed... edit the course 
        //console.dir("editing the course...")
        this.courseService.edit(new Course(this.course.id, this.name.value, this.min.value, this.max.value, this.enabled, this.teacherId))
          .subscribe(
            (editedCourse: Course) => {
                // console.dir("course " + editedCourse.id + " edited successfully - owner: " + editedCourse.teacherId)
                this.emitter.emit()
                this.dialogRef.close(editedCourse)
            },
            err => {
              //console.dir(JSON.stringify(err))
              const snackbarMessage = new SnackbarMessage(err.error)
              this.snackBar.open(snackbarMessage.message, null, { duration: 5000 })
            }
          )
      } else {
        /* no changes */
        this.dialogRef.close(this.course)
      }
    } else {
      this.name.markAsTouched({onlySelf: true})
      this.min.markAsTouched({onlySelf: true})
      this.max.markAsTouched({onlySelf: true})
    }
  }

  getNameErrorMessage() {
    if (this.name.hasError('required')) {
      return 'Name is required'
    } else {
      return ''
    }
  }

  getMinErrorMessage() {
    if (this.min.hasError('required')) {
      return 'Min is required'
    }  else if (this.max.hasError('pattern')) {
      return 'Min is a number!'
    } else return 'min <= max'
  }

  getMaxErrorMessage() {
    if (this.max.hasError('required')) {
      return 'Max is required'
    } else if (this.max.hasError('pattern')) {
      return 'Max is a number!'
    } else return 'max >= min'
  }

}
