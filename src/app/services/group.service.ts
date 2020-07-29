import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {EMPTY, Observable, of, throwError} from 'rxjs';
import {Group, TEST_GROUP} from '../models/group.model';
import {catchError, map} from 'rxjs/operators';
import {Student} from '../models/student.model';
import { StudentService } from './student.service';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
};

@Injectable({
    providedIn: 'root'
})
export class GroupService {

    private API_PATH = 'http://localhost:3000/groups';

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

}
