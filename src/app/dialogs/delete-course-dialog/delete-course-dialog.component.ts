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
export class DeleteCourseDialogComponent implements OnInit {

  id: FormControl
  name: FormControl

  course: Course
  emitter: EventEmitter<string>

  constructor(private dialogRef: MatDialogRef<DeleteCourseDialogComponent>, @Inject(MAT_DIALOG_DATA) public data) {
    this.course = data.course
    this.emitter = data.emitter

    this.id = new FormControl(this.course.id);
    this.name = new FormControl(this.course.name);
  }

  ngOnInit(): void {
  }

  cancel() {
    this.dialogRef.close(false)
  }

  deleteCourse() {
    //console.dir("delete course - emit: (courseId: " + this.course.id + ")")
    this.emitter.emit(this.course.id)
    this.dialogRef.close(true)
  }

}
