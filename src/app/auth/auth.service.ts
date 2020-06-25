import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap, shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private API_PATH = 'http://localhost:3000';
  
  constructor(private http: HttpClient, private router: Router) { }

  loginUser(email: string, password: string) : Observable<any> {
    return this.http.post<any>(`${this.API_PATH}/login`, { email, password })
                .pipe(
                  tap( res => {
                    //console.dir("AuthService - loginUser() - .tap() --> token: " + res.accessToken);
                    this.setSession(res);
                  }),
                  shareReplay()
                );
  }

  private setSession(authResult: any) {
    const token = JSON.parse(atob(authResult.accessToken.split('.')[1]));
    
    localStorage.setItem('token', authResult.accessToken);
    localStorage.setItem('email', token.email);
    // json-server-auth token field exp contains epoch of exportation (last 1 hour)
    localStorage.setItem('expires_at', token.exp);
    
  }

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("expires_at");
  }

  getExpiration() {
    const expiration = localStorage.getItem("expires_at");
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }

  public getEmail() {
    return localStorage.getItem("email");
  }

  public isLoggedIn() {
    return moment().isBefore(moment.unix(+localStorage.getItem('expires_at')));
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }

}
