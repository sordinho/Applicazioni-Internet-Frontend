import { Component, OnInit } from '@angular/core';

import { Student } from '../models/student.model';
import { StudentService } from '../services/student.service';
import { Observable } from 'rxjs';


const courseId = "1"; // we have only one course: [ { "id": 1, "name": "Applicazioni Internet", "path": "applicazioni-internet" } ]

@Component({
  selector: 'app-students-cont',
  templateUrl: './students-cont.component.html',
  styleUrls: ['./students-cont.component.css']
})
export class StudentsContComponent implements OnInit {

  enrolledStudents: Student[] = [];
  allStudents: Student[] = [];

  constructor(private studentService: StudentService) { }

  ngOnInit(): void {
    this.getEnrolledStudents();
    this.getAllStudents();
  }

  getAllStudents() {
    this.studentService.queryAll()
                        .subscribe((data) => { 
                          //console.dir("getAllStudents() -> " + data);
                          this.allStudents = data;
                        })
  }

  getEnrolledStudents() {
    this.studentService.queryEnrolled(`${courseId}`)
                        .subscribe((data) => { 
                          //console.dir("getEnrolledStudents() -> " + data);
                          this.enrolledStudents = data; 
                        });
  }

  enrollStudents(students: Student[]) {
    this.studentService.enroll(students, courseId)
                          .subscribe( _ => {
                            console.dir("enrollStudents(" + students + ")");
                            this.getEnrolledStudents();
                            this.getAllStudents();
                          });
  }

  unenrollStudents(students: Student[]) {
    this.studentService.unenroll(students)
                          .subscribe( _ => {
                            console.dir("unenrollStudents(" + students +")");
                            this.getEnrolledStudents();
                            this.getAllStudents();
                          });
  }

}
