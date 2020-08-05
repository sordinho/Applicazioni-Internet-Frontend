import { Injectable } from '@angular/core';
import { Course } from '../models/course.model';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
}

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  
  private API_PATH = 'API/courses';

  constructor(private http: HttpClient) { }

  create(course: Course) {
    /* create course */
    return this.http.post<Course>(`${this.API_PATH}`, course)
  }

  find(courseId: string): Observable<Course> {
    /* find course (by courseId) */
    return this.http
                .get<Course>(`${this.API_PATH}/${courseId}`)
                .pipe(
                  catchError( err => {
                    console.error(err);
                    return throwError(`CourseService.find error: ${err.message}`);
                  })
                )
  }

  queryAll(): Observable<Course[]> { 
    /* return courses list */
    return this.http
                .get<any>(`${this.API_PATH}`)
                .pipe(
                  catchError( err => {
                    console.error(err);
                    return throwError(`CourseService.queryAll error: ${err.message}`)
                  }),
                  /*map( data => {
                    var allStudents: Student[] = [];
                    if(data !== null) {
                      data._embedded.studentDTOList.forEach( (student: Student) => {
                        allStudents.push(new Student(student.id, student.lastName, student.firstName, student.email, student.image));
                      });
                    }
                    return allStudents;
                  })*/
                )
  }

  enable(courseId: string): Observable<any> {
    return this.http
                .post<any>(`${this.API_PATH}/${courseId}/enable`, courseId)
                .pipe(
                  catchError( err => {
                    console.error(err);
                    return throwError(`CourseService.enable error: ${err.message}`)
                  })
                )
  }

  disable(courseId: string): Observable<any> {
    return this.http
                .post<any>(`${this.API_PATH}/${courseId}/disable`, courseId)
                .pipe(
                  catchError( err => {
                    console.error(err);
                    return throwError(`CourseService.disable error: ${err.message}`)
                  })
                )
  }

}