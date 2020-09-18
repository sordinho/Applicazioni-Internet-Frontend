import {Injectable} from '@angular/core';
import {HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse} from '@angular/common/http';
import {EMPTY, observable, Observable, of, throwError} from 'rxjs';
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
            })

            return next.handle(cloned).pipe(
                catchError( (error: HttpErrorResponse) => {
                    if(error.status === 401){
                        this.authService.refreshToken().subscribe(
                            succ => {
                                console.dir("refresh - success")
                                //this.intercept(request, next)
                                return next.handle(cloned)
                            }, 
                            err => {
                                this.router.navigate(['/login'])
                                return of(null);
                            },
                            () => {
                                console.dir("DEBUG - ()")
                            }
                        )
                    }
                    else{
                        return throwError(error);
                    }    
                }))
                
            //console.log('AuthInterceptor accessToken found: ' + JSON.stringify(accessToken));
        } else {
            // console.log('AuthInterceptor accessToken not found');
            return next.handle(request)
        }
    }


}
