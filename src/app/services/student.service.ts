import {Injectable} from '@angular/core';

import {Student} from '../models/student.model';
import {Observable, throwError, forkJoin, of} from 'rxjs';
import {map, catchError, retry, tap, shareReplay, flatMap} from 'rxjs/operators';

import {HttpClient, HttpErrorResponse, HttpResponse, HttpHeaders} from '@angular/common/http';
import {Team} from '../models/team.model';


const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
};

@Injectable({
    providedIn: 'root'
})
export class StudentService {

    private API_PATH = 'API/students';

    constructor(private http: HttpClient) {
    }

    create(student: Student) {
        /* create student */
        return this.http.post<any>(`${this.API_PATH}`, student);
    }

    update(student: Student): Observable<Student> {
        /* update student */
        return this.http
            .put<Student>(`${this.API_PATH}/${student.id}`, student, httpOptions)
            .pipe(
                catchError(err => {
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
                catchError(err => {
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
                catchError(err => {
                    console.error(err);
                    return throwError(`StudentService.queryAll error: ${err.message}`);
                }),
                map(data => {
                    /* convert explicitly the result to Student[]: important to be shown in the mat autocomplete (StudentComponent),
                       otherwise it would be shown [Object, Object] */
                    var allStudents: Student[] = [];
                    if (data !== null) {
                        data._embedded.studentDTOList.forEach((student: Student) => {
                            allStudents.push(new Student(student.id, student.lastName, student.firstName, student.email, student.image));
                        });
                    }
                    return allStudents;
                })
            );
    }

    queryEnrolled(courseId: string): Observable<Student[]> {
        return this.queryAll();
        /* return enrolled students list (by courseId)
        return this.http
                    .get<Student[]>(`${this.API_PATH}?courseId=${courseId}`)
                    .pipe(
                      catchError( err => {
                        console.error(err);
                        return throwError(`StudentService.queryAll ${courseId} error: ${err.message}`);
                      }),
                      map( data => {
                        var enrolledStudents: Student[] = [];
                        data.forEach( student => {
                          enrolledStudents.push(new Student(student.id, student.lastName, student.firstName, student.courseId, student.id));
                        });
                        return enrolledStudents;
                      })
                    )
      */
    }

    delete(studentId: string): Observable<Student[]> {
        /* delete student (by studentId) */
        return this.http
            .delete<Student[]>(`${this.API_PATH}/${studentId}`)
            .pipe(
                catchError(err => {
                    console.error(err);
                    return throwError(`StudentService.delete ${studentId} error: ${err.message}`);
                })
            );
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

    getUnconfirmedTeamsByCourse(studentId: string, courseId: string): Observable<Team[]> {
        return this.http
            .get<any>(`${this.API_PATH}/${studentId}/courses/${courseId}/propose-team`)
            .pipe(
                catchError(err => {
                    console.error(err);
                    return throwError(`StudentService.getProposedTeamsByCourse error: ${err.message}`);
                }),
                map(data => {
                    /* convert explicitly the result to Team[]: important to be shown in the mat autocomplete (StudentComponent),
                       otherwise it would be shown [Object, Object] */
                    var allTeams: Team[] = [];
                    if (data !== null) {
                        data._embedded.studentDTOList.forEach((team:
                                                                   Team) => {
                            allTeams.push(new Team(team.id, team.name, team.status));
                        });
                    }
                    return allTeams;
                })
            );
    }

    getTeamByCourse(studentId: string, courseId: string): Observable<Team> {
        /* find student (by studentId) */
        return this.http
            .get<Team>(`${this.API_PATH}/${studentId}/courses/${courseId}/team`)
            .pipe(
                catchError(err => {
                    console.error(err);
                    return of(null); // return null so i can handle the 404
                    // return throwError(`StudentService.find error: ${err.message}`);
                })
            );
    }

}
