import { Component, OnInit, OnDestroy } from '@angular/core';
import { CourseService } from '../services/course.service';
import { Course } from '../models/course.model';
import { AuthService } from '../services/auth.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { StudentService } from '../services/student.service';
import { TeacherService } from '../services/teacher.service';

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
  userId: string

  paramMapSub: Subscription

  constructor(private courseService: CourseService, private authService: AuthService, private studentService: StudentService, private teacherService: TeacherService, private router: Router, private activatedRoute: ActivatedRoute) {
    this.userId = authService.getUserId()
  }

  ngOnInit(): void {
    this.paramMapSub = this.activatedRoute.paramMap.subscribe(
      (params: ParamMap) => {
        this.courseId = params.get('courseId')
        this.setCourseName()
      });

    this.getUserRole()
    this.getUsername()

    this.getAllCourses()
  }

  ngOnDestroy() {
    if(this.paramMapSub != undefined) {
      //console.dir("AppComponent - ngOnDestroy() - this.paramMapSub.unsubscribe()");
      this.paramMapSub.unsubscribe();
    }
  }

  getAllCourses() {
    if(this.userRole === "ROLE_STUDENT") {
      this.studentService.queryCourses(this.userId).subscribe((data) => {
                                                                this.allCourses = data
                                                                if(this.courseId !== null) 
                                                                  this.setCourseName()
                                                              })
    } else if(this.userRole === "ROLE_TEACHER") {
      this.teacherService.queryCourses(this.userId).subscribe((data) => {
                                                                this.allCourses = data
                                                                if(this.courseId !== null) 
                                                                  this.setCourseName()
                                                              })
    }
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

  delelteCourse(selectedCourseId: string) {
    this.courseService.delete(selectedCourseId).subscribe(
      succ => {
        //console.dir("course " + selectedCourseId + " delete successfully - succ: " + succ)

        if(this.courseId !== null && this.courseId === selectedCourseId) {
          // the current "routed" course is the deleted one --> redirect to /courses  
          //console.dir("navigate to /courses")
          this.router.navigate(['/courses'])
        }
        else {
          // the current "routed" course is not the deleted one --> no redirect --> reload all courses...  
          //console.dir("reload all courses...")
          this.getAllCourses()
        }
      },
      err => {
        console.dir("removeCourse (error) - err: " + err) 
      })
  }

  logout() {
    this.authService.logout()
    if(this.authService.isLoggedOut()) {
      this.router.navigate(['/login']);
    }
  }

}
