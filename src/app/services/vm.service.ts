import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {EMPTY, Observable} from 'rxjs';
import {Vm} from '../models/vm.model';

@Injectable({
    providedIn: 'root'
})
export class VmService {

    private API_PATH = 'http://localhost:3000/groups';

    constructor(private http: HttpClient) {
    }

    getVmsByGroupId(groupId: string): Observable<Vm[]> {
        return EMPTY;
    }
}
