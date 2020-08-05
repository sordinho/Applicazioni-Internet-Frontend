import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, tap, shareReplay} from 'rxjs/operators';
import {Observable} from 'rxjs';
import * as moment from 'moment';
import {Router} from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private API_PATH = '/auth';

    constructor(private http: HttpClient, private router: Router) {
    }

    signinUser(username: string, password: string): Observable<any> {
        return this.http.post<any>(`${this.API_PATH}/sign-in`, {username, password})
            .pipe(
                tap(res => {
                    //console.dir("AuthService - signinUser() - .tap() --> token: " + res.token);
                    this.setSession(res);
                }),
                shareReplay()
            );
    }

    registerUser(username: string, password: string): Observable<any> {
        return this.http.post<any>(`${this.API_PATH}/register`, {username, password})
            .pipe(
                tap(res => {
                    //console.dir("AuthService - registerUser() - .tap() --> token: " + res.token);
                    this.setSession(res);
                }),
                shareReplay()
            )
    }

    private setSession(authResult: any) {
        const token = JSON.parse(atob(authResult.token.split('.')[1]));

        localStorage.setItem('token', authResult.token);
        // console.log('ruolo: ' + token.roles);
        localStorage.setItem('role', token.roles);
        // console.log('email: ' + authResult.username);
        localStorage.setItem('email', authResult.username);
        // json-server-auth token field exp contains epoch of exportation (last 1 hour)
        localStorage.setItem('expires_at', token.exp);
        // console.dir("exp_at: " + token.exp)
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('expires_at');
    }

    getExpiration() {
        const expiration = localStorage.getItem('expires_at');
        const expiresAt = JSON.parse(expiration);
        return moment(expiresAt);
    }

    public getEmail() {
        return localStorage.getItem('email');
    }

    isStudent() {
        return localStorage.getItem('role') === 'ROLE_STUDENT';
    }

    isTeacher() {
        return localStorage.getItem('role') === 'ROLE_TEACHER';
    }

    getRole(): string {
        return localStorage.getItem('role');
    }

    public isLoggedIn() {
        let loggedIn = moment().isBefore(moment.unix(+localStorage.getItem('expires_at')))
        if(!loggedIn) {
            // clean the token
            this.logout()
        }
        return loggedIn
    }

    isLoggedOut() {
        return !this.isLoggedIn()
    }

}

export interface UserInformationRequest {
    id: string
    email: string
    lastName: string
    firstName: string
    password: string
    repeatPassword: string 
}