import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {EMPTY, Observable, of, throwError} from 'rxjs';
import {Vm} from '../models/vm.model';
import {catchError} from 'rxjs/operators';
import {Student} from '../models/student.model';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
};

@Injectable({
    providedIn: 'root'
})
export class VmService {

    private API_PATH = 'http://localhost:3000/'; // TODO change to server api url

    constructor(private http: HttpClient) {
    }

    getVmOwners(vmID: string): Observable<Student[]> {
        return this.http
            .get<Student[]>(`${this.API_PATH}/virtual-machines/${vmID}/owners`)
            .pipe(catchError(err => {
                console.error(err);
                return throwError(`VmService.getVmOwners error: ${err.message}`);
            }));
    }

    createNewVm(num_vcpu: number, ram: number, disk_space: number, creatorId: string, teamId: string, modelId: string): Observable<Vm> {
        return this.http.post<any>(`${this.API_PATH}/virtual-machines`, {
            'num_vcpu': num_vcpu,
            'disk_space': disk_space,
            'ram': ram,
            'studentId': creatorId,
            'teamId': teamId,
            'modelId': modelId
        }, httpOptions).pipe(catchError(err => {
            console.error(err);
            return throwError(`VmService.createNewVm error: ${err.message}`);
        }));

    }


}
