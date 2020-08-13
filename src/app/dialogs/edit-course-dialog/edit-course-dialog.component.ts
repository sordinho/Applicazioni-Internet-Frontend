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
  id: FormControl
  min: FormControl
  max: FormControl

  enabled = true

  course: Course
  emitter: EventEmitter<void>

  teacherId: string

  constructor(private dialogRef: MatDialogRef<EditCourseDialogComponent>, @Inject(MAT_DIALOG_DATA) public data, authService: AuthService, private courseService: CourseService, private snackBar: MatSnackBar) { 
    this.emitter = data.emitter
    this.course = data.course

    this.name = new FormControl(data.course.name, {
      updateOn: 'blur',
      validators: [Validators.required]
    })
  
    this.id = new FormControl(data.course.id, {
      updateOn: 'submit',
      validators: [Validators.required]
    })
  
    this.min = new FormControl(data.course.min, {
      validators: [
        Validators.required,
        Validators.pattern("^[0-9]*$")
      ]
    })
  
    this.max = new FormControl(data.course.max, {
      validators: [
        Validators.required,
        Validators.pattern("^[0-9]*$")
      ]
    })

    this.enabled = data.course.enabled

    this.teacherId = authService.getUserId()

  }

  ngOnInit(): void {
  }

  onNameChange(value: string) {
    if(value === '') this.id.setValue('')
    else this.id.setValue(this.getInitials(value))
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
    if (!this.id.invalid && !this.name.invalid && !this.min.invalid && !this.max.invalid) { 
      if(this.min.value > this.max.value) {
        /* error in min and max values */
        this.max.setErrors({'invalid': true})
        this.min.setErrors({'invalid': true})
        return
      }
      
      /* all fields are valid */
      this.courseService.edit(new Course(this.id.value, this.name.value, this.min.value, this.max.value, this.enabled, this.teacherId))
            .subscribe(
              (editedCourse: Course) => {
                // console.dir("course " + editedCourse.id + " edited successfully - owner: " + editedCourse.teacherId)
                this.emitter.emit()
                this.dialogRef.close(editedCourse)
              },
              err => {
                // console.dir("editCourse (error) - err: " + err)
                const snackbarMessage = new SnackbarMessage(err.error)
                this.snackBar.open(snackbarMessage.message, snackbarMessage.action, { duration: 5000 })
              }
            )

    } else {
      this.id.markAsTouched({onlySelf: true})
      this.name.markAsTouched({onlySelf: true})
      this.min.markAsTouched({onlySelf: true})
      this.max.markAsTouched({onlySelf: true})
    }

  }

  getIdErrorMessage() {
    if (this.id.hasError('required')) {
      return 'Id is required'
    } else {
      return ''
    }
  }

  getNameErrorMessage() {
    if (this.id.hasError('required')) {
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
