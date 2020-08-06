import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { Course } from 'src/app/models/course.model';
import { CourseService } from 'src/app/services/course.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delete-course-dialog',
  templateUrl: './delete-course-dialog.component.html',
  styleUrls: ['./delete-course-dialog.component.css']
})
export class DeleteCourseDialogComponent implements OnInit {

  id: FormControl
  name: FormControl

  constructor(private dialogRef: MatDialogRef<DeleteCourseDialogComponent>, @Inject(MAT_DIALOG_DATA) public course: Course, private courseService: CourseService, private router: Router) {
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
    this.courseService.delete(this.course.id).subscribe(
      val => {
        console.dir("course " + this.course.id + " delete successfully")
        //this.dialogRef.close()        
        this.router.navigate(['/courses'])
        this.dialogRef.close(true)
      },
      err => {
        console.dir("removeCourse (error) - err: " + err)
        this.dialogRef.close(false)   
      })
  }

}
