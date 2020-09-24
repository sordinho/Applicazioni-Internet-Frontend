import { Component, OnInit } from '@angular/core';

import { Student } from '../../models/student.model';
import { StudentService } from '../../services/student.service';
import { CourseService } from 'src/app/services/course.service';
import { ActivatedRoute } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { SnackbarMessage } from 'src/app/models/snackbarMessage.model';

@Component({
  selector: 'app-students-cont',
  templateUrl: './students-cont.component.html',
  styleUrls: ['./students-cont.component.css']
})
export class StudentsContComponent implements OnInit {

  enrolledStudents: Student[] = []
  allStudents: Student[] = []
  unenrolledStudents: Student[] = []

  snackbarMessage: SnackbarMessage

  courseId: string

  constructor(private studentService: StudentService, private courseService: CourseService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.courseId = this.route.snapshot.parent.url[1].toString()

    this.initStudentsLists()
  }

  initStudentsLists() {
    const allStudentsReq$: Observable<Student[]> = this.studentService.queryAll()
    const enrolledStudentsReq$ = this.courseService.queryEnrolledStudent(`${this.courseId}`)

    /* forkJoin - When all observables complete, emit the last emitted value from each */
    forkJoin([allStudentsReq$, enrolledStudentsReq$]).subscribe( res => { 
      this.allStudents = res[0]
      this.enrolledStudents = res[1]
      //console.dir("allStudents: " + this.allStudents)
      //console.dir("enrolledStudents: " + this.enrolledStudents)
      this.unenrolledStudents = this.allStudents.filter((stud: Student) => {
        //console.dir("student: " + stud.id + " filter: " + (this.enrolledStudents.find(s => s.id === stud.id) !== undefined))
        return this.enrolledStudents.find(s => s.id === stud.id) === undefined
      })
    })

  }

  reloadEnrolledStudents() {
    this.courseService.queryEnrolledStudent(`${this.courseId}`).subscribe( (enrolledStudents: Student[]) => {
      this.enrolledStudents = enrolledStudents
      this.unenrolledStudents = this.allStudents.filter((stud: Student) => {
        return this.enrolledStudents.find(s => s.id === stud.id) === undefined
      })
    })
  }

  enrollStudent(student: Student) {
    this.courseService.enroll(student, this.courseId)
                          .subscribe( _ => {
                            this.snackbarMessage = new SnackbarMessage(student.lastName + " " + student.firstName + " has been enrolled", "UNDO", () => { this.unenrollStudents([student]) })
                            this.reloadEnrolledStudents() // reload students list
                          })
  }

  unenrollStudents(students: Student[]) {
    this.courseService.unenroll(students, this.courseId)
                          .subscribe( 
                            res => {
                              let errorNum = 0
                              for(let error of res) {
                                if(error !== null) {
                                  /* look at course.service unenroll function to understand why I managed 
                                     error in this way (the res is the result of a forkJoin operation */ 
                                  errorNum++
                                }
                              }
                              if(errorNum > 1) {
                                this.snackbarMessage = new SnackbarMessage(`${errorNum} student/s cannot be unenrolled (i.e. they belong to a group)`)
                              } else if(errorNum === 1) {
                                this.snackbarMessage = new SnackbarMessage(`${errorNum} student cannot be unenrolled (i.e. he belongs to a group)`)
                              }
                              this.reloadEnrolledStudents() // reload students list
                            }
                          )
  }

}

