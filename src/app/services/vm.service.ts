import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {EMPTY, Observable, of} from 'rxjs';
import {TEST_VM_UBUNTU, TEST_VM_WIN, Vm} from '../models/vm.model';

@Injectable({
    providedIn: 'root'
})
export class VmService {

    private API_PATH = 'http://localhost:3000/groups';

    constructor(private http: HttpClient) {
    }

    getVmsByGroupId(groupId: string): Observable<Vm[]> {
        return of([TEST_VM_UBUNTU, TEST_VM_WIN]);
    }
}
