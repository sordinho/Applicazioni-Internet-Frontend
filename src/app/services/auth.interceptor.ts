import {Injectable} from '@angular/core';
import {HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse} from '@angular/common/http';
import {EMPTY, Observable, of, throwError} from 'rxjs';
import {AuthService} from './auth.service';
import {Router} from '@angular/router';
import {catchError} from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService, private router: Router) {
    }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        const accessToken = localStorage.getItem('token');
        if (accessToken) {
            const cloned = request.clone({
                headers: request.headers.set('Authorization', 'Bearer ' + accessToken)
            });
            return next.handle(cloned).pipe(
                catchError((error) => {
                    if (error.code !== 401) {
                        // 401 handled in auth.interceptor
                        this.router.navigate(['/login']);
                    }
                    return of(null);
                }));

            //console.log('AuthInterceptor accessToken found: ' + JSON.stringify(accessToken));
        } else {
            // console.log('AuthInterceptor accessToken not found');
            return next.handle(request);
        }
    }


}
