import { Component, OnInit, Inject, EventEmitter, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { Course } from 'src/app/models/course.model';
import { CourseService } from 'src/app/services/course.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-delete-course-dialog',
  templateUrl: './delete-course-dialog.component.html',
  styleUrls: ['./delete-course-dialog.component.css']
})
export class DeleteCourseDialogComponent implements OnInit, OnDestroy {

  id: FormControl
  name: FormControl
  sub: Subscription

  course: Course
  emitter: EventEmitter<string>

  constructor(private dialogRef: MatDialogRef<DeleteCourseDialogComponent>, @Inject(MAT_DIALOG_DATA) public data) {
    this.course = data.course
    this.emitter = data.emitter

    this.id = new FormControl(this.course.id);
    this.name = new FormControl(this.course.name);
  }

  ngOnInit(): void {
    this.sub = this.emitter.subscribe(
      succ => {
        this.dialogRef.close(true)
      },
      err => {
        this.dialogRef.close(false)   
      }
    )
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe()
  }

  cancel() {
    this.dialogRef.close(false)
  }

  deleteCourse() {
    this.emitter.emit(this.course.id)
  }

}
