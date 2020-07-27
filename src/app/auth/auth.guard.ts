import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from './auth.service';
import {state} from '@angular/animations';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) {
    }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        let url: string = state.url;
        //console.dir("AuthGuard - canActivate() - checkLogin(" + url + ") --> " + this.checkLogin(url));

        if (this.authService.isLoggedIn()) {
            const courseId = next.paramMap.get('courseId');

            if (courseId === null) {
                return true;
            }

            if (courseId === 'PdS' || courseId === 'AI' || courseId === 'MAD') {
                return true;
            } else {
                this.router.navigate(['/courses']);
                return false;
            }
        }

        //console.dir("AuthGuard - url = " + url);
        if (url !== '/courses') {
            // Navigate to the login page with extras
            this.router.navigate(['/login'], {queryParams: {redirect_to: url}});
        } else {
            // Navigate to the login page without extras
            this.router.navigate(['/login']);
        }

        return false;
    }

    canActivateChild(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        //console.log('Can Activate Child: ' + this.authService.getRole());
        if (this.authService.isTeacher()) {
            if (state.url.endsWith('vms') || state.url.endsWith('students') || state.url.endsWith('assignments')) {
                return true;
            } else {
                this.router.navigate(['/courses']);
            }
        } else if (this.authService.isStudent()) {
            if (state.url.endsWith('vm') || state.url.endsWith('groups') || state.url.endsWith('deliveries')) {
                return true;
            } else {
                this.router.navigate(['/courses']);
            }
        }
        return false;
    }

}
