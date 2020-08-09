import { Injectable } from '@angular/core';
import { Course } from '../models/course.model';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable, throwError, forkJoin } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Student } from '../models/student.model';

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
                  map( data => {
                    var courses: Course[] = [];
                    if(data !== undefined && data._embedded !== undefined) {
                      data._embedded.courseDTOList.forEach( (course: Course) => {
                        courses.push(new Course(course.id, course.name, course.min, course.max, course.enabled, course.teacherId))
                      })
                    }
                    return courses;
                  })
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

  delete(courseId: string): Observable<any> {
    /* delete course (by courseId) */
    return this.http
                .delete<any>(`${this.API_PATH}/${courseId}`)
                .pipe(
                  catchError( err => {
                    console.error(err);
                    return throwError(`CourseService.delete ${courseId} error: ${err.message}`);
                })
              );
  }  

  queryEnrolledStudent(courseId: string): Observable<Student[]> { 
    /* return enrolled students list (by courseId) */
    return this.http
                .get<any>(`${this.API_PATH}/${courseId}/enrolled`)
                .pipe(
                  catchError( err => {
                    console.error(err);
                    return throwError(`CourseService.queryEnrolledStudent ${courseId} error: ${err.message}`);
                  }),
                  map( data => {
                    /* convert explicitly the result to Student[] */
                    var enrolledStudents: Student[] = [];
                    if(data !== undefined && data._embedded !== undefined) {
                      data._embedded.studentDTOList.forEach( (student: Student) => {
                        enrolledStudents.push(new Student(student.id, student.lastName, student.firstName, student.email, student.image));
                      });
                    }
                    return enrolledStudents;
                  })
                )
  }

  enroll(students: Student[], courseId: string): Observable<Student[]> {
    const requests$ = new Array<Observable<Student>>();

    students.forEach( student => {
      requests$.push(
        this.http.post<Student>(`${this.API_PATH}/${courseId}/enrollOne`, {'studentId': student.id })
          .pipe(
            catchError( err => {
            console.error(err);
            return throwError(`CourseService.enrollOne ${student.id} error: ${err.message}`);
          })
        )
      )
    });
    
    return forkJoin(requests$)
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
  
}
