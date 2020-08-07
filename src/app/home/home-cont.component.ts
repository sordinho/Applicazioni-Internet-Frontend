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
        //console.dir("activatedRoute change - " + params.get('courseId'))
        this.courseId = params.get('courseId')
      });

    this.getUserRole()
    this.getUsername()

    this.getAllCourses().subscribe((data) => {
                          this.allCourses = data
                          if(this.courseId !== null) 
                            this.setCourseName()
                        })
  }

  ngOnDestroy() {
    if(this.paramMapSub != undefined) {
      //console.dir("AppComponent - ngOnDestroy() - this.paramMapSub.unsubscribe()");
      this.paramMapSub.unsubscribe();
    }
  }

  getAllCourses(): Observable<Course[]>  {
    if(this.userRole === "ROLE_STUDENT") {
      return this.studentService.queryCourses(this.userId)
    } else if(this.userRole === "ROLE_TEACHER") {
      return this.teacherService.queryCourses(this.userId)
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

  addCourse(course: Course) {
    this.courseService.create(course)
    .subscribe((createdCourse: Course) => {
      this.router.navigate(['/courses/' + createdCourse.id])
    })
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
