import { Component, OnInit } from '@angular/core';

import { Student } from '../../models/student.model';
import { StudentService } from '../../services/student.service';
import { CourseService } from 'src/app/services/course.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-students-cont',
  templateUrl: './students-cont.component.html',
  styleUrls: ['./students-cont.component.css']
})
export class StudentsContComponent implements OnInit {

  enrolledStudents: Student[] = []
  allStudents: Student[] = []

  courseId: string

  constructor(private studentService: StudentService, private courseService: CourseService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.courseId = this.route.snapshot.parent.url[1].toString()
    this.getAllStudents()
    this.getEnrolledStudents()
  }

  getAllStudents() {
    this.studentService.queryAll()
                        .subscribe((data) => { 
                          this.allStudents = data;
                        })
  }

  getEnrolledStudents() {
    //console.dir("getEnrolledStudents (courseId: " + this.courseId + ")")
    this.courseService.queryEnrolledStudent(`${this.courseId}`)
                        .subscribe((data) => { 
                          this.enrolledStudents = data
                        });
  }

  enrollStudents(students: Student[]) {
    console.dir("enrollStudent - TODO (courseService)")
    /*this.studentService.enroll(students, courseId)
                          .subscribe( _ => {
                            //console.dir("enrollStudents(" + students + ")");
                            this.getEnrolledStudents();
                            this.getAllStudents();
                          });*/
  }

  unenrollStudents(students: Student[]) {
    console.dir("unenrollStudent - TODO (courseService)")
    /*this.studentService.unenroll(students)
                          .subscribe( _ => {
                            //console.dir("unenrollStudents(" + students +")");
                            this.getEnrolledStudents();
                            this.getAllStudents();
                          });*/
  }

}
