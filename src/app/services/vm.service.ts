import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {EMPTY, Observable, of, throwError} from 'rxjs';
import {TEST_VM_UBUNTU, TEST_VM_WIN, Vm, VmConfigurationModel} from '../models/vm.model';
import {catchError} from 'rxjs/operators';
import {Student} from '../models/student.model';
import {VmModel} from '../models/vmModel.model';

@Injectable({
    providedIn: 'root'
})
export class VmService {

    private API_PATH = 'http://localhost:3000/'; // TODO change to server api url

    constructor(private http: HttpClient) {
    }

    getTeamConfiguration(groupId: string): Observable<VmConfigurationModel> {
        return this.http
            .get<VmConfigurationModel>(`${this.API_PATH}/teams/${groupId}/configuration`)
            .pipe(catchError(err => {
                console.error(err);
                return throwError(`VmService.getConfiguration error: ${err.message}`);
            }));
    }

    getVmsByGroupId(groupId: string): Observable<Vm[]> {
        return of([TEST_VM_UBUNTU, TEST_VM_WIN]);

        return this.http
            .get<Vm[]>(`${this.API_PATH}/teams/${groupId}/virtual-machines`)
            .pipe(catchError(err => {
                console.error(err);
                return throwError(`VmService.getVmsByGroupId error: ${err.message}`);
            }));
    }

    getVmOwners(vmID: string): Observable<Student[]> {
        return this.http
            .get<Student[]>(`${this.API_PATH}/virtual-machines/${vmID}/owners`)
            .pipe(catchError(err => {
                console.error(err);
                return throwError(`VmService.getVmOwners error: ${err.message}`);
            }));
    }

    getVmModel(courseID: string): Observable<VmModel> {
        return this.http
            .get<VmModel>(`${this.API_PATH}/courses/${courseID}/model`)
            .pipe(catchError(err => {
                console.error(err);
                return throwError(`VmService.getVmModel error: ${err.message}`);
            }));
    }


}
