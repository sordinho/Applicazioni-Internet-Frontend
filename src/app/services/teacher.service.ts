import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {Course} from '../models/course.model';
import {HttpHeaders, HttpClient} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {User} from '../models/user.model';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
};

@Injectable({
    providedIn: 'root'
})
export class TeacherService {

    private API_PATH = 'API/teachers';

    constructor(private http: HttpClient) {
    }

    queryCourses(teacherId: string): Observable<Course[]> {
        /* return courses list */
        return this.http
            .get<any>(`${this.API_PATH}/${teacherId}/courses`)
            .pipe(
                catchError(err => {
                    console.error(err);
                    return throwError(`TeacherService.queryCourses error: ${err.message}`);
                }),
                map(data => {
                    var courses: Course[] = [];
                    if (data !== undefined && data._embedded !== undefined) {
                        data._embedded.courseList.forEach((course: Course) => {
                            courses.push(new Course(course.id, course.name, course.min, course.max, course.enabled, course.teacherId));
                        });
                    }
                    return courses;
                })
            );
    }

    queryTeacherData(teacherId: string): Observable<User> {
        return this.http.get<any>(`${this.API_PATH}/${teacherId}`)
            .pipe(
                catchError(err => {
                    //console.error('CODE: ' + err.status);
                    return throwError(`TeacherService.queryTeacherData error: ${err.message}`);
                }), map(data => {
                    let image = null;
                    if (data.image != null) {
                        image = 'data:image/jpeg;base64,' + data.image;
                    }
                    return new User(data.id, data.lastName, data.firstName, data.email, image);
                })
            );
    }

}
