import { Component, OnInit, OnDestroy } from '@angular/core';
import { CourseService } from '../services/course.service';
import { Course } from '../models/course.model';
import { AuthService } from '../services/auth.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home-cont',
  templateUrl: './home-cont.component.html',
  styleUrls: ['./home-cont.component.css']
})
export class HomeContComponent implements OnInit, OnDestroy {

  allCourses: Course[] = []
  username: string
  userRole: string
  courseId: string
  courseName: string

  paramMapSub: Subscription

  constructor(private courseService: CourseService, private authService: AuthService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.getActivatedRouteCourseId()
    this.getAllCourse()
    this.getUsername()
    this.getUserRole()
  }

  ngOnDestroy() {
    if(this.paramMapSub != undefined) {
      //console.dir("AppComponent - ngOnDestroy() - this.paramMapSub.unsubscribe()");
      this.paramMapSub.unsubscribe();
    }
  }

  getActivatedRouteCourseId() {
    this.paramMapSub = this.activatedRoute.paramMap.subscribe(
      (params: ParamMap) => {
        //console.dir("activatedRoute change - " + params.get('courseId'))
        this.courseId = params.get('courseId')
        this.getAllCourse()
      });
  }

  getAllCourse() {
    this.courseService.queryAll()
                        .subscribe((data) => {
                          this.allCourses = data
                          if(this.courseId !== null) 
                            this.setCourseName()
                        })
  }

  setCourseName() {
    for(let c of this.allCourses) {
      if(c.id === this.courseId) {
        this.courseName = c.name
      }
    }
  }

  getUsername() {
    this.username = this.authService.getUserId()
  }

  getUserRole() {
    this.userRole = this.authService.getRole()
  }

  logout() {
    this.authService.logout()
    if(this.authService.isLoggedOut()) {
      this.router.navigate(['/login']);
    }
  }

}
