import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { CourseService } from 'src/app/services/course.service';
import { Course } from 'src/app/models/course.model';

@Component({
  selector: 'app-new-course-dialog',
  templateUrl: './new-course-dialog.component.html',
  styleUrls: ['./new-course-dialog.component.css']
})
export class NewCourseDialogComponent implements OnInit {

  id = new FormControl('', {
    updateOn: 'blur',
    validators: [Validators.required]
  })

  name = new FormControl('', {
    updateOn: 'blur',
    validators: [Validators.required]
  })
  
  min = new FormControl('1', {
    updateOn: 'blur',
    validators: [
      Validators.required,
      Validators.pattern("^[0-9]*$")
    ]
  })

  max = new FormControl('1', {
    updateOn: 'blur',
    validators: [
      Validators.required,
      Validators.pattern("^[0-9]*$")
    ]
  })

  enable = true

  error = false

  constructor(private dialogRef: MatDialogRef<NewCourseDialogComponent>, private courseService: CourseService) { }

  ngOnInit(): void {
  }

  cancel() {
    this.dialogRef.close(false)
  }

  addCourse() {
    if(this.min.value >= this.max.value) {
      /* error in min and max values */
      this.max.setErrors({'invalid': true})
      this.min.setErrors({'invalid': true})
    } else if (!this.id.invalid && !this.name.invalid && !this.min.invalid && !this.max.invalid) { 
      /* all fields are valid */
      this.courseService.create(new Course(this.id.value, this.name.value, this.min.value, this.max.value))
        .subscribe((createdCourse: Course) => {
          if(this.enable === true) 
          this.dialogRef.close({ id: this.id.value, name: this.name.value })        
        },
        err => {
          console.dir("addCourse (error) - err: " + err)
          this.error = true
        })
    } 
  }

  enableCourse() {
    this.courseService.enable(this.id.value)
      .subscribe(res => {
        console.dir("course enabled: " + res)
      },
      err => {
        console.dir("course enable error: " + err)
      })
  }

  disableCourse() {
    this.courseService.disable(this.id.value)
    .subscribe(res => {
      console.dir("course disabled: " + res)
    },
    err => {
      console.dir("course disable error: " + err)
    })
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
    } else return 'a'
  }

  getMaxErrorMessage() {
    if (this.max.hasError('required')) {
      return 'Max is required'
    } else if (this.max.hasError('pattern')) {
      return 'Max is a number!'
    } else return 'b'
  }

}
