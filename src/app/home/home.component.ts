import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthService } from '../auth/auth.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { NewCourseDialogComponent } from '../dialogs/new-course-dialog/new-course-dialog.component';
import { EditCourseDialogComponent } from '../dialogs/edit-course-dialog/edit-course-dialog.component';
import { DeleteCourseDialogComponent } from '../dialogs/delete-course-dialog/delete-course-dialog.component';

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

  // courseId of the course with the menu opened
  courseMenu: string = '';
  
  courseSelected = false;
  isTeacher = false;
  
  navLinks: any[];

  constructor(private authService: AuthService, private activatedRoute: ActivatedRoute, private router: Router, private matDialog: MatDialog) { 
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
    //console.dir("[home.components.ts] addCourse()");
    
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = "500px";
    
    const dialogRef = this.matDialog.open(NewCourseDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(course => {
      if(course) {
        //console.dir("addCourse() - success ");
        this.courses.push(course) 
      } else {
        // user pressed cancel (?)
        console.dir("addCourse() - unsuccess");
      }
    });
  }
  
  editCourse() {
    //console.dir("[home.components.ts] editCourse()");
    
    let index: number = this.courses.findIndex(course => course.id === this.courseMenu)

    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = "500px";
    dialogConfig.data = this.courses[index];
    
    const dialogRef = this.matDialog.open(EditCourseDialogComponent, dialogConfig)
    
    dialogRef.afterClosed().subscribe(course => {
      if(course) {
        //console.dir("editCourse() - success ");
        this.courses[index] = course
      } else {
        // user pressed cancel (?)
        console.dir("editCourse() - unsuccess");
      }
    });
  }

  deleteCourse() {
    //console.dir("[home.components.ts] deleteCourse()");
    
    let index: number = this.courses.findIndex(course => course.id === this.courseMenu)

    if(index === -1) {
      return
    }

    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.width = "500px";
    dialogConfig.data = this.courses[index];
    
    const dialogRef = this.matDialog.open(DeleteCourseDialogComponent, dialogConfig)
    
    dialogRef.afterClosed().subscribe(success => {
      if(success) {
        //console.dir("removeCourse() - success ");    
        this.courses.splice(index, 1)
      } else {
        // user pressed cancel (?)
        console.dir("deleteCourse() - unsuccess");
      }
    });

    

  }

}