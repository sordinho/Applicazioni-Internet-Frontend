import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {VmModel} from '../models/vmModel.model';
import {Observable, throwError} from 'rxjs';
import {catchError, map, shareReplay, tap} from 'rxjs/operators';
import {Vm} from '../models/vm.model';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
};

@Injectable({
    providedIn: 'root'
})
export class VmModelService {

    private API_PATH = 'API/virtual-machine-models';

    constructor(private http: HttpClient) {
    }

    getAllModels(): Observable<VmModel[]> {
        return this.http
            .get<string[]>(`${this.API_PATH}`)
            .pipe(
                catchError(err => {
                    console.error(err);
                    return throwError(`VmModelService.getAllModels error: ${err.message}`);
                }),
                map(data => {
                    let vmModels: VmModel[] = [];
                    if (data !== undefined) {
                        data.forEach((value) => {
                            let model = new VmModel(value);
                            vmModels.push(model);
                        });
                    }
                    return vmModels;
                })
            );
    }

    getModelInfoByDirectLink(link: string): Observable<VmModel> {
        return this.http.get<any>(link)
            .pipe(
                catchError(err => {
                    console.error(err);
                    return throwError(`VmModelService.getModelInfoByDirectLink error: ${err.message}`);
                }),
                map(data => {
                    // console.log('model: ' + data.os);
                    let model = new VmModel(data.os);
                    model.uniqueId = data.id;
                    return model;
                })
            );
    }

    deleteVmModel(uniqueId: string): Observable<any> {
        return this.http.delete<any>(`${this.API_PATH}/${uniqueId}`)
            .pipe(
                catchError(err => {
                    console.error(err);
                    return throwError(`VmModelService.deleteVmModel error: ${err.message}`);
                }));
    }

    createVmModel(courseId: string, os: string): Observable<VmModel> {
        return this.http.post<any>(`${this.API_PATH}`, {os, courseId})
            .pipe(
                catchError(err => {
                    console.error(err);
                    return throwError(`VmModelService.createVmModel error: ${err.message}`);
                }),
                map(data => {
                    let model = new VmModel(data.os);
                    model.uniqueId = data.id;
                    return model;
                }));

    }
}
