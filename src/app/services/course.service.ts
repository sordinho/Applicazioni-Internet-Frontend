import {Injectable} from '@angular/core';
import {Course} from '../models/course.model';
import {HttpHeaders, HttpClient} from '@angular/common/http';
import {Observable, throwError, forkJoin, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {Student} from '../models/student.model';
import {SnackbarMessage} from '../models/snackbarMessage.model';
import {Team} from '../models/team.model';

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
        return this.http.post<Course>(`${this.API_PATH}`, course)
    }

    edit(course: Course) {
        /* edit course */
        return this.http.put<Course>(`${this.API_PATH}/${course.id}`, course)
    }

    enable(courseId: string): Observable<string> {
        /* enable course */
        return this.http.post<string>(`${this.API_PATH}/${courseId}/enable`, null)
    }

    disable(courseId: string): Observable<string> {
        /* disable course */
        return this.http.post<string>(`${this.API_PATH}/${courseId}/disable`, null)
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
                );
    }

    queryAll(): Observable<Course[]> {
        /* return courses list */
        return this.http
            .get<any>(`${this.API_PATH}`)
            .pipe(
                catchError(err => {
                    console.error(err);
                    return throwError(`CourseService.queryAll error: ${err.message}`);
                }),
                map(data => {
                    var courses: Course[] = [];
                    if (data !== undefined && data._embedded !== undefined) {
                        data._embedded.courseDTOList.forEach((course: Course) => {
                            courses.push(new Course(course.id, course.name, course.min, course.max, course.enabled, course.teacherId));
                        });
                    }
                    return courses;
                })
            );
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
                        //console.error(JSON.stringify(err));
                        return throwError(`${err.error.message}`);
                    })
                );
    }

    queryEnrolledStudent(courseId: string): Observable<Student[]> {
        /* return enrolled students list (by courseId) */
        return this.http
            .get<any>(`${this.API_PATH}/${courseId}/enrolled`)
            .pipe(
                catchError(err => {
                    console.error(err);
                    return throwError(`CourseService.queryEnrolledStudent ${courseId} error: ${err.message}`);
                }),
                map(data => {
                    /* convert explicitly the result to Student[] */
                    var enrolledStudents: Student[] = [];
                    if (data !== undefined && data._embedded !== undefined) {
                        data._embedded.studentDTOList.forEach((student: Student) => {
                            enrolledStudents.push(new Student(student.id, student.lastName, student.firstName, student.email, student.image));
                        });
                    }
                    return enrolledStudents;
                })
            );
    }

    enroll(students: Student[], courseId: string): Observable<any[]> {
        const requests$ = new Array<Observable<any>>();

        students.forEach(student => {
            requests$.push(
                this.http.post<any>(`${this.API_PATH}/${courseId}/enrollOne`, {'studentId': student.id})
                    .pipe(
                        catchError(err => {
                            console.error(err);
                            return throwError(`CourseService.enrollOne ${student.id} error: ${err.message}`);
                        })
                    )
            );
        });

        return forkJoin(requests$);
    }

    unenroll(students: Student[], courseId: string): Observable<any> {
        const requests$ = new Array<Observable<any>>();

        students.forEach(student => {
            requests$.push(
                this.http.delete<any>(`${this.API_PATH}/${courseId}/enrolled/${student.id}`)
                    .pipe(
                        catchError(e =>
                            /* return throwError(`CourseService.unenroll ${student.id} error: ${err.message}`)
                               is not used because if any of the inner observable supplied to forkJoin error,
                               all other value of any other observables that would or have already completed
                               will be lost. --> it is necessary to return an observable and manage it in the
                               subscribe function!!

                               the error returned by the backend is an object: error: {some information + message: '...' }
                               --> of(e.error) and in the subscribe function the message is accessed by val.message */
                            of(e.error)
                        )
                    )
            );
        });

        return forkJoin(requests$);
    }


    queryAvailableStudents(courseId: string): Observable<Student[]> {
        /* return students list */
        return this.http
            .get<any>(`${this.API_PATH}/${courseId}/teams/available-students`)
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
                        data._embedded.studentDToes.forEach((student: Student) => {
                            allStudents.push(new Student(student.id, student.lastName, student.firstName, student.email, student.image));
                        });
                    }
                    return allStudents;
                })
            );
    }
}

interface groupProposal {
    teamName: string;
    memberIds: string[];
    studentId: string;
    timeout: string;
}
