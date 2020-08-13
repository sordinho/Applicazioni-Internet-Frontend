import { Component, ViewChild, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { NewCourseDialogComponent } from '../dialogs/new-course-dialog/new-course-dialog.component';
import { EditCourseDialogComponent } from '../dialogs/edit-course-dialog/edit-course-dialog.component';
import { DeleteCourseDialogComponent } from '../dialogs/delete-course-dialog/delete-course-dialog.component';
import { Course } from '../models/course.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  _courses: Course[]
  _userId: string
  _isTeacher: boolean = false
  _courseName: string = null
  _courseSelected: boolean = false 

  // component Input interfaces 
  @Input() set courses(allCourses: Course[]) {
    this._courses = allCourses
  }
  @Input() set userId(username: string) {
    this._userId = username
  }
  @Input() set isTeacher(userRole: string) {
    this._isTeacher = (userRole  === 'ROLE_TEACHER')
  }
  @Input() set courseName(courseName: string) {
    this._courseName = courseName  
    this._courseSelected = (this._courseName !== undefined)
  }

  // component Output interfaces 
  @Output() logoutEmitter = new EventEmitter<void>()
  @Output() reloadCoursesEmitter = new EventEmitter<void>()
  @Output() deleteCourseEmitter = new EventEmitter<string>()

  title = 'VirtualLabs'
  @ViewChild('sidenav') sidenav: MatSidenav

  // courseId of the course with the menu opened
  courseMenu: string = '';
  
  navLinks: any[];

  constructor(private matDialog: MatDialog) { }

  ngOnInit() { 
      if(this._isTeacher) {
        this.navLinks = [
          { path: 'students', label: 'Students' },
          { path: 'vms', label: 'VMs' },
          { path: 'assignments', label: 'Assignments' }
        ];
      } else {
        // student tabs
        this.navLinks = [
          { path: 'groups', label: 'Groups' },
          { path: 'vm', label: 'VM' },
          { path: 'deliveries', label: 'Deliveries' }
        ];
      }
  }

  toggleForMenuClick() {
    this.sidenav.toggle();
  }

  logout() {
    this.logoutEmitter.emit()
  }

  openMenu(event, courseId :string, ) {
    event.stopPropagation()
    this.courseMenu = courseId
  }

  addCourse() {
    //console.dir("[home.components.ts] addCourse()");
    
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.width = "500px";
    dialogConfig.data = { 
      emitter: this.reloadCoursesEmitter
    }
    
    this.matDialog.open(NewCourseDialogComponent, dialogConfig)
  }
  
  editCourse() {
    //console.dir("[home.components.ts] editCourse()");
    
    let index: number = this._courses.findIndex(course => course.id === this.courseMenu)

    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = "500px";
    dialogConfig.data = { 
      course: this._courses[index],
      emitter: this.reloadCoursesEmitter
    }
    
    const dialogRef = this.matDialog.open(EditCourseDialogComponent, dialogConfig)
    
    dialogRef.afterClosed().subscribe(course => {
      if(course) {
        //console.dir("editCourse() - success ");
        this._courses[index] = course
      } else {
        // user pressed cancel (?)
        console.dir("editCourse() - unsuccess");
      }
    });
  }

  deleteCourse() {
    //console.dir("[home.components.ts] deleteCourse()");
    
    let index: number = this._courses.findIndex(course => course.id === this.courseMenu)

    if(index === -1) {
      return
    }

    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.width = "500px";
    dialogConfig.data = { 
      course: this._courses[index],
      emitter: this.deleteCourseEmitter
    }
    
    this.matDialog.open(DeleteCourseDialogComponent, dialogConfig)
  }

}