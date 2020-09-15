import {Injectable, OnInit} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import {Observable, of} from 'rxjs';
import {AuthService} from '../services/auth.service';
import { Course } from '../models/course.model';
import { StudentService } from '../services/student.service';
import { TeacherService } from '../services/teacher.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate, OnInit {


    constructor(private authService: AuthService, private router: Router, private studentService: StudentService, private teacherService: TeacherService) {
    }

    ngOnInit(): void  {
        
    }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        let url: string = state.url;
        //console.dir("AuthGuard - canActivate() - checkLogin(" + url + ") --> " + this.checkLogin(url));

        if (this.authService.isLoggedIn()) {
            const courseId = next.paramMap.get('courseId');

            if (courseId === null) {
                return true;
            }
            
            const userRole = this.authService.getRole()
            const userId = this.authService.getUserId()
            const service = userRole === "ROLE_STUDENT" ? this.studentService : this.teacherService 

            return new Observable<boolean>(obs => service.queryCourses(userId).subscribe((data) => {
                                                                        if (data.find(course => course.id === courseId) !== undefined) {
                                                                            return obs.next(true);
                                                                        } else {
                                                                            this.router.navigate(['/courses']);
                                                                            return obs.next(false);
                                                                        }

                                                                    }))
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
