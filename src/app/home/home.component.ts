import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthService } from '../auth/auth.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy{

  courses = [
    { id: "PdS", name: "Programmazione di Sistema" },
    { id: "AI", name: "Applicazioni Internet" },
    { id: "MAD", name: "Mobile Application Development" }
  ]

  title = 'VirtualLabs';
  @ViewChild('sidenav') sidenav: MatSidenav;
  
  paramMapSub: Subscription;
  email = this.authService.getEmail();
  courseName: string = '';

  courseMenu: string = '';
  
  courseSelected = false;
  isTeacher = false;
  
  navLinks: any[];

  constructor(private authService: AuthService, private activatedRoute: ActivatedRoute, private router: Router) { 
    this.isTeacher = authService.isTeacher();
  }

  ngOnInit() { 
    this.paramMapSub = this.activatedRoute.paramMap.subscribe(
      (params: ParamMap) => {
        const courseId = params.get('courseId');
        if(courseId !== null) {
          //console.dir("courseId: " + courseId);
          this.setCourse(courseId);
        }
      });

      if(this.authService.isStudent()) {
        this.navLinks = [
          { path: 'groups', label: 'Groups' },
          { path: 'vm', label: 'VM' },
          { path: 'deliveries', label: 'Deliveries' }
        ];
      } else if(this.authService.isTeacher()) {
        this.navLinks = [
          { path: 'students', label: 'Students' },
          { path: 'vms', label: 'VMs' },
          { path: 'assignments', label: 'Assignments' }
        ];
      }

  }

  ngOnDestroy() {
    if(this.paramMapSub != undefined) {
      //console.dir("AppComponent - ngOnDestroy() - this.paramMapSub.unsubscribe()");
      this.paramMapSub.unsubscribe();
    }
  }

  toggleForMenuClick() {
    this.sidenav.toggle();
  }

  logout() {
    this.authService.logout()
    if(this.authService.isLoggedOut()) {
      this.router.navigate(['/login']);
    }
  }

  getEmail() {
    return this.authService.getEmail();
  }

  setCourse(courseId: string) {
    this.courseSelected = true;
    let name: string
    this.courses.forEach(function (course) {
      if(course.id === courseId) {
        name = course.name
      }
    })
    this.courseName = name
  }

  openMenu(event, courseId :string, ) {
    event.stopPropagation()
    this.courseMenu = courseId
  }

  addCourse() {
    console.dir("TODO - [home.components.ts] addCourse()");
  }
  
  editCourse() {
    console.dir("TODO - [home.components.ts] editCourse() - " + this.courseMenu);
  }

  deleteCourse() {
    console.dir("TODO - [home.components.ts] deleteCourse() - " + this.courseMenu);
  }

}