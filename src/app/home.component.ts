import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthService } from './auth/auth.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy{
  title = 'VirtualLabs';
  @ViewChild('sidenav') sidenav: MatSidenav;
  
  paramMapSub: Subscription;
  email = this.authService.getEmail();
  courseName: string;
  
  courseSelected = false;
  
  navLinks = [
    { path: 'students', label: 'Students' },
    { path: 'vms', label: 'VMs' },
    { path: 'assignments', label: 'Assignments' }
  ];

  constructor(private authService: AuthService, private activatedRoute: ActivatedRoute, private router: Router) { 
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

  setCourse(courseName: string) {
    this.courseSelected = true;
    switch (courseName) {
      case 'AI' :
        this.courseName = 'Applicazioni Internet'
        break;
      case 'PdS':
        this.courseName = 'Programmazione Di Sistema'
        break;
      default:
        this.courseName = ''
        break;
    }
  }

  courseNavigate(courseName: string) {
    switch (courseName) {
      case 'AI' :
        this.router.navigate(['courses/AI']);
        break;
      case 'PdS':
        this.router.navigate(['courses/PdS']);
        break;
      default:
        this.courseName = ''
        break;
    }
  }

}