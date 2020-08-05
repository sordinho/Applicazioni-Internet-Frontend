import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {EMPTY, Observable, of, throwError} from 'rxjs';
import {Group, TEST_GROUP} from '../models/group.model';
import {catchError, map} from 'rxjs/operators';
import {Student} from '../models/student.model';
import { StudentService } from './student.service';
import { Resources } from '../models/resources.model';

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

    getAllGroups(): Observable<Group[]> {
        return of([TEST_GROUP]);
    }

    getGroupsByCourse(courseID: string): Observable<Group[]> {
        return EMPTY;
    }

    getStudentGroup(studentID: string, courseID): Observable<Group> {
        return of(TEST_GROUP);
    }

    getStudentWithoutGroup(courseID): Observable<Student[]> {
        return this.studentService.queryAll();
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
            return data._embedded.studentDTOList
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
