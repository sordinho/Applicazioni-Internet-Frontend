import {Injectable} from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService) {}
    
    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        const accessToken = localStorage.getItem('token');
        if (accessToken) {
            const cloned = request.clone({
                headers: request.headers.set('Authorization', 'Bearer ' + accessToken)
            });
            
            //console.log('AuthInterceptor accessToken found: ' + JSON.stringify(accessToken));
            return next.handle(cloned);
        } else {
            //console.log('AuthInterceptor accessToken not found');
            return next.handle(request);
        }
    }

}
