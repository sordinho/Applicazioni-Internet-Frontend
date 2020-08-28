import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Student} from '../models/student.model';
import {catchError} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';
import {ConfigurationModel} from '../models/configuration.model';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
};

@Injectable({
    providedIn: 'root'
})
export class ConfigurationService {

    private API_PATH = 'API/configurations';

    constructor(private http: HttpClient) {
    }

    getConfigurationByLink(link: string): Observable<ConfigurationModel> {
        return this.http
            .get<ConfigurationModel>(link)
            .pipe(catchError(err => {
                console.error(err);
                return throwError(`ConfigurationService.getConfiguration error: ${err.message}`);
            }));
    }

    createNewConfiguration(config: ConfigurationModel): Observable<ConfigurationModel> {
        return this.http
            .post<any>(`${this.API_PATH}`, {
                'min_vcpu': config.min_vcpu,
                'max_vcpu': config.max_vcpu,
                'min_disk': config.min_disk,
                'max_disk': config.max_disk,
                'min_ram': config.min_ram,
                'max_ram': config.max_ram,
                'tot': config.tot,
                'max_on': config.max_on,
                'teamId': config.teamId,
            }, httpOptions)
            .pipe(catchError(err => {
                console.error(err);
                return throwError(`ConfigurationService.createNewConfiguration error: ${err.message}`);
            }));
    }

    updateConfiguration(config: ConfigurationModel): Observable<ConfigurationModel> {
        return this.http
            .put<any>(`${this.API_PATH}/${config.id}`, {
                'min_vcpu': config.min_vcpu,
                'max_vcpu': config.max_vcpu,
                'min_disk': config.min_disk,
                'max_disk': config.max_disk,
                'min_ram': config.min_ram,
                'max_ram': config.max_ram,
                'tot': config.tot,
                'max_on': config.max_on,
                'teamId': config.teamId,
            }, httpOptions)
            .pipe(catchError(err => {
                console.error(err);
                return throwError(`ConfigurationService.updateConfiguration error: ${err.message}`);
            }));
    }
}
