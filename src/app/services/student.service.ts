import { Injectable } from '@angular/core';

import { Student } from '../models/student.model';
import { Observable, throwError, forkJoin, of } from 'rxjs';
import { map, catchError, retry, tap, shareReplay, flatMap } from 'rxjs/operators';

import { HttpClient, HttpErrorResponse, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Group } from '../models/group.model';
import { GroupService } from './group.service';
import { Resources } from '../models/resources.model';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
}
  
@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private API_PATH = 'API/students';

  constructor(private http: HttpClient) { }

  create(student: Student) {
    /* create student */
    return this.http.post<any>(`${this.API_PATH}`, student)
  }

  update(student: Student): Observable<Student> {
    /* update student */
    return this.http
                .put<Student>(`${this.API_PATH}/${student.id}`, student, httpOptions)
                .pipe(
                  catchError( err => {
                    console.error(err);
                    return throwError(`StudentService.update error: ${err.message}`);
                  })
                );
  }

  find(studentId: string): Observable<Student> {
    /* find student (by studentId) */
    return this.http
                .get<Student>(`${this.API_PATH}/${studentId}`)
                .pipe(
                  catchError( err => {
                    console.error(err);
                    return throwError(`StudentService.find error: ${err.message}`);
                  })
                );
  }

  queryAll(): Observable<Student[]> { 
    /* return students list */
    return this.http
                .get<any>(`${this.API_PATH}`)
                .pipe(
                  catchError( err => {
                    console.error(err);
                    return throwError(`StudentService.queryAll error: ${err.message}`);
                  }),
                  map( data => {
                    /* convert explicitly the result to Student[]: important to be shown in the mat autocomplete (StudentComponent),
                       otherwise it would be shown [Object, Object] */
                    var allStudents: Student[] = [];
                    if(data !== undefined && data._embedded !== undefined) {
                      data._embedded.studentDTOList.forEach( (student: Student) => {
                        allStudents.push(new Student(student.id, student.lastName, student.firstName, student.email, student.image));
                      });
                    }
                    return allStudents;
                  })
                )
  }

  enroll(students: Student[], courseId: string) {
    /*const requests$ = new Array<Observable<Student>>();

    students.forEach( student => {
      if(student.courseId != courseId) {
        student.courseId = courseId;
        requests$.push(this.update(student));
      }
    });
    
    return forkJoin(requests$);*/
  }

  unenroll(students: Student[]) {
    /*const requests$ = new Array<Observable<Student>>();

    students.forEach( student => {
      if(student.courseId != "0") {
        student.courseId = "0";
        requests$.push(this.update(student));
      }
    });
    
    return forkJoin(requests$);*/
  }

  getTeamByCourse(studentId: string, courseId: string): Observable<Group> {
    /* find student (by studentId) */
    return this.http
                .get<Group>(`${this.API_PATH}/${studentId}/courses//${courseId}/team`)
                .pipe(
                  catchError( err => {
                    console.error(err);
                    return throwError(`StudentService.find error: ${err.message}`);
                  })
                )
  }
  
}
