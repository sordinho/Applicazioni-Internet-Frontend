import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {EMPTY, Observable} from 'rxjs';
import {Group} from '../models/group.model';

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

    constructor(private http: HttpClient) {
    }

    getAllGroups(): Observable<Group[]> {
        return EMPTY;
    }
}
