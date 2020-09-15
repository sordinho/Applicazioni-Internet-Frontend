import {Component, OnInit, OnDestroy} from '@angular/core';
import {CourseService} from '../services/course.service';
import {Course} from '../models/course.model';
import {AuthService} from '../services/auth.service';
import {Router, ActivatedRoute, ParamMap} from '@angular/router';
import {Subscription, Observable} from 'rxjs';
import {StudentService} from '../services/student.service';
import {TeacherService} from '../services/teacher.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {User} from '../models/user.model';

@Component({
    selector: 'app-home-cont',
    templateUrl: './home-cont.component.html',
    styleUrls: ['./home-cont.component.css']
})
export class HomeContComponent implements OnInit, OnDestroy {

    allCourses: Course[] = [];
    username: string;
    userRole: string;
    courseId: string;
    courseName: string;
    userId: string;
    courseDataFetched: boolean;

    userData: User;

    paramMapSub: Subscription;

    constructor(private courseService: CourseService, private authService: AuthService, private studentService: StudentService, private teacherService: TeacherService, private router: Router, private activatedRoute: ActivatedRoute, private snackBar: MatSnackBar) {
        this.userId = authService.getUserId();
    }

    ngOnInit(): void {
        this.paramMapSub = this.activatedRoute.paramMap.subscribe(
            (params: ParamMap) => {
                this.courseId = params.get('courseId');
                this.setCourseName();
            });

        this.getUserRole();
        this.getUsername();
        this.initUserData();
        this.getAllCourses();
    }

    ngOnDestroy() {
        if (this.paramMapSub != undefined) {
            //console.dir("AppComponent - ngOnDestroy() - this.paramMapSub.unsubscribe()");
            this.paramMapSub.unsubscribe();
        }
    }

    initUserData() {
        if (this.userRole === 'ROLE_STUDENT') {
            this.studentService.queryStudentData(this.userId).subscribe((data) => {
                this.userData = data;
            });
        } else if (this.userRole === 'ROLE_TEACHER') {
            this.teacherService.queryTeacherData(this.userId).subscribe((data) => {
                this.userData = data;
            });
        }
    }

    getAllCourses() {
        if (this.userRole === 'ROLE_STUDENT') {
            this.studentService.queryCourses(this.userId).subscribe((data) => {
                this.allCourses = data;
                this.courseDataFetched = true;
                if (this.courseId !== null) {
                    this.setCourseName();
                }
            });
        } else if (this.userRole === 'ROLE_TEACHER') {
            this.teacherService.queryCourses(this.userId).subscribe((data) => {
                this.allCourses = data;
                this.courseDataFetched = true;
                if (this.courseId !== null) {
                    this.setCourseName();
                }
            });
        }
    }

    setCourseName() {
        for (let c of this.allCourses) {
            if (c.id === this.courseId) {
                this.courseName = c.name;
            }
        }
    }

    getUsername() {
        this.username = this.authService.getUserId();
    }

    getUserRole() {
        this.userRole = this.authService.getRole();
    }

    delelteCourse(selectedCourseId: string) {
        this.courseService.delete(selectedCourseId).subscribe(
            succ => {
                //console.dir("course " + selectedCourseId + " delete successfully - succ: " + succ)

                if (this.courseId !== null && this.courseId === selectedCourseId) {
                    // the current "routed" course is the deleted one --> redirect to /courses
                    //console.dir("navigate to /courses")
                    this.router.navigate(['/courses']);
                } else {
                    // the current "routed" course is not the deleted one --> no redirect --> reload all courses...
                    //console.dir("reload all courses...")
                    this.getAllCourses();
                }
            },
            errorMessage => {
                this.snackBar.open(errorMessage, null, {duration: 5000});
            });
    }

    enableCourse(courseId: string) {
        this.courseService.enable(courseId).subscribe(
            succ => {
                this.allCourses.find(course => course.id === courseId).enabled = true;
                this.snackBar.open('Course enabled', null, {duration: 3000});
            }
        );
    }

    disableCourse(courseId: string) {
        this.courseService.disable(courseId).subscribe(
            succ => {
                this.allCourses.find(course => course.id === courseId).enabled = false;
                this.snackBar.open('Course disabled', null, {duration: 3000});
            }
        );
    }

    logout() {
        this.authService.logout();
        if (this.authService.isLoggedOut()) {
            this.router.navigate(['/login']);
        }
    }

}
