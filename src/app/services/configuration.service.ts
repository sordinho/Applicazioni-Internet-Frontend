import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Student} from '../models/student.model';
import {catchError} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';
import {ConfigurationModel} from '../models/configuration.model';

@Injectable({
    providedIn: 'root'
})
export class ConfigurationService {

    private API_PATH = 'API/virtual-machines';

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
}
