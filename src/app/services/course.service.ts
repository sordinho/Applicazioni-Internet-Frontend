import {Injectable} from '@angular/core';
import {Course} from '../models/course.model';
import {HttpHeaders, HttpClient} from '@angular/common/http';
import {Observable, throwError, forkJoin, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {Student} from '../models/student.model';
import {SnackbarMessage} from '../models/snackbarMessage.model';
import {Team} from '../models/team.model';
import {Assignment} from '../models/assignment.model';

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

    edit(course: Course) {
        /* edit course */
        return this.http.put<Course>(`${this.API_PATH}/${course.id}`, course);
    }

    enable(courseId: string): Observable<string> {
        /* enable course */
        return this.http.post<string>(`${this.API_PATH}/${courseId}/enable`, null);
    }

    disable(courseId: string): Observable<string> {
        /* disable course */
        return this.http.post<string>(`${this.API_PATH}/${courseId}/disable`, null);
    }

    find(courseId: string): Observable<Course> {
        /* find course (by courseId) */
        return this.http
            .get<any>(`${this.API_PATH}/${courseId}`)
            .pipe(
                catchError(err => {
                    console.error(err);
                    return throwError(`CourseService.find error: ${err.message}`);
                }),
                map(data => {
                    let course = new Course(data.id, data.name, data.min, data.max, data.enabled, data.teacherId);
                    if (data._links.virtualMachineModel) {
                        course.vmModelLink = data._links.virtualMachineModel.href;
                    }
                    return course;
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
                catchError(err => {
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
                        data._embedded.studentList.forEach((student: Student) => {
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
                        data._embedded.studentList.forEach((student: Student) => {
                            allStudents.push(new Student(student.id, student.lastName, student.firstName, student.email, student.image));
                        });
                    }
                    return allStudents;
                })
            );
    }

    queryAllAssigments(courseId: string): Observable<Assignment[]> {
        /* Retrieve all the assignments for the course */
        return this.http
            .get<any>(`${this.API_PATH}/${courseId}/assignments`)
            .pipe(
                catchError(err => {
                    return throwError(`CourseService.queryAllAssignments error: ${err}`);
                }),
                map(data => {
                    var assignments: Assignment[] = [];
                    if (data !== undefined && data._embedded !== undefined) {
                        data._embedded.assignmentList.forEach((a: any) => {
                            let image = 'data:image/jpeg;base64,' + a.image;
                            assignments.push(new Assignment(a.id, a.published, a.expired, image));
                        });
                    }
                    return assignments;
                })
            );
    }

    getAllGroups(courseId: string): Observable<Team[]> {
        return this.http.get<any>(`${this.API_PATH}/${courseId}/teams`)
            .pipe(
                catchError(err => {
                    console.error(JSON.stringify(err));
                    return throwError(`CourseService.getAllGroups error: ${err}`);
                }),
                map(data => {
                    console.log(data);
                    let teams: Team[] = [];
                    if (data !== undefined && data._embedded !== undefined) {
                        data._embedded.teamList.forEach((t: any) => {
                            let newTeam = new Team(t.id, t.name, t.status);
                            if (t._links.virtualMachineConfiguration) {
                                console.log('Team ' + newTeam.id + ' has config');
                                newTeam.configurationLink = t._links.virtualMachineConfiguration.href;
                            }
                            teams.push(newTeam);
                        });
                    }
                    return teams;
                }));
    }

    addAssignment(courseId: string, expireDate: Date, file: File): Observable<any> {
        // Add fields to prepare the request
        let body = new FormData();
        body.append('image', file, file.name);
        body.append('expiredDate', expireDate.toLocaleDateString());

        return this.http.post<any>(`${this.API_PATH}/${courseId}/assignment`, body)
            .pipe(
                catchError(err => {
                    console.error(err);
                    return throwError(`CourseService.addAssignment error: ${err.message}`);
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
