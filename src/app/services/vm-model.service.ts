import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {VmModel} from '../models/vmModel.model';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
};

@Injectable({
    providedIn: 'root'
})
export class VmModelService {

    private API_PATH = 'API//API/virtual-machine-models';

    constructor(private http: HttpClient) {
    }

    getAllModels(): Observable<VmModel[]> {
        return this.http
            .get<string[]>(`${this.API_PATH}`)
            .pipe(
                catchError(err => {
                    console.error(err);
                    return throwError(`StudentService.find error: ${err.message}`);
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
}
