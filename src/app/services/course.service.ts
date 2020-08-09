import { Injectable } from '@angular/core';
import { Course } from '../models/course.model';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Student } from '../models/student.model';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
};

@Injectable({
    providedIn: 'root'
})
export class CourseService {

    private API_PATH = 'API/courses';

    constructor(private http: HttpClient) {
    }

    create(course: Course) {
        /* create course */
        return this.http.post<Course>(`${this.API_PATH}`, course);
    }

    find(courseId: string): Observable<Course> {
        /* find course (by courseId) */
        return this.http
            .get<Course>(`${this.API_PATH}/${courseId}`)
            .pipe(
                catchError(err => {
                    console.error(err);
                    return throwError(`CourseService.find error: ${err.message}`);
                })
            );
    }

    queryAll(): Observable<Course[]> {
        /* return courses list */
        return this.http
            .get<any>(`${this.API_PATH}`)
            .pipe(
                catchError(err => {
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

    createTeam(courseId: string, teamName: string, memberIds: string[], studentId: string, timeout: string) {
        // propose a new team
        return this.http.post<Team>(`${this.API_PATH}/${courseId}/createTeam`, {
            teamName,
            memberIds,
            studentId,
            timeout
        }, httpOptions)
            .pipe(
                catchError(err => {
                    console.error(err);
                    return throwError(`CourseService.createTeam error: ${err.message}`);
                })
            );

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

}

interface groupProposal {
    teamName: string;
    memberIds: string[];
    studentId: string;
    timeout: string;
}
