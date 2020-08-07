import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {EMPTY, Observable, of, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {Student} from '../models/student.model';
import { StudentService } from './student.service';
import { Resources } from '../models/resources.model';
import {Team, TEST_GROUP} from '../models/team.model';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
};

@Injectable({
    providedIn: 'root'
})
export class GroupService {

    private API_PATH = 'API/teams';

    constructor(private http: HttpClient ,private studentService:StudentService) {
    }

    getAllGroups(): Observable<Team[]> {
        return of([TEST_GROUP]);
    }

    getMembers(teamId: string): Observable<Student[]> {
        /* find members (by teamId) */
        return this.http
        .get<any>(`${this.API_PATH}/${teamId}/members`)
        .pipe(
            catchError( err => {
                console.error(err);
                return throwError(`GroupService.getMembers error: ${err.message}`);
            }),
            map( data => {
                /* convert explicitly the result to Student[]: important to be shown in the mat autocomplete (StudentComponent),
                       otherwise it would be shown [Object, Object] */
                var allStudents: Student[] = [];
                if (data !== null) {
                    data._embedded.studentDToes.forEach((student: Student) => {
                        allStudents.push(new Student(student.id, student.lastName, student.firstName, student.email, student.image));
                    });
                }
                return allStudents;
        }))
    }

    getResources(teamId: string): Observable<Resources> {
        return this.http
        .get<Resources>(`${this.API_PATH}/${teamId}/virtual-machines/resources`)
        .pipe(
            catchError( err => {
                console.error(err);
                return throwError(`GroupService.getResources error: ${err.message}`);
            })
        );
    }

}
