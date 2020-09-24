import { Component, Input, ViewChild, AfterViewInit, EventEmitter, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Student } from '../../models/student.model';
import { MatSort } from '@angular/material/sort';
import { MatCheckbox } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatPaginator } from '@angular/material/paginator';
import { SnackbarMessage } from 'src/app/models/snackbarMessage.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { EnrollStudentsCsvDialogComponent } from 'src/app/dialogs/enroll-students-csv-dialog/enroll-students-csv-dialog.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements AfterViewInit {

  constructor(private snackBar: MatSnackBar, private matDialog: MatDialog, private route: ActivatedRoute) { }

  /* student selected - to be added to enrolled student */
  addStudentSelection: Student = null

  /* selectionModel used to keep track of selected students */
  selectionModel: SelectionModel<Student> = new SelectionModel<Student>(true, [])

  dataSource: MatTableDataSource<Student>
  
  colsToDisplay = ['select'].concat('id', 'lastName', 'firstName', 'group');

  // ViewChilds
  @ViewChild(MatSort, { static: true }) sort: MatSort
  @ViewChild('auto') auto: MatAutocomplete
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator
  @ViewChild('masterCheckbox') private masterCheckbox: MatCheckbox

  _unenrolledStudents: Student[];
  _filteredStudents: Student[];
  _enrolledStudents: Student[];

  // component Input interfaces 
  @Input() set unenrolledStudents(unenrolledStudents: Student[]) {
    this._unenrolledStudents = unenrolledStudents
    this._filteredStudents = unenrolledStudents // at the beginning the filtered student list (search bar) is equal to unenrolledStudents 
  }
  @Input() set enrolledStudents(students: Student[]) {
    this._enrolledStudents = students
    if(this.dataSource != undefined) {
      this.dataSource.data = students
    } else {
      this.dataSource = new MatTableDataSource<Student>(students)
    }
  }
  @Input() set snackbarMessage(snackbarMessage: SnackbarMessage) {
    if(snackbarMessage !== undefined) {
      const snackBarRef = this.snackBar.open(snackbarMessage.message, snackbarMessage.action, { duration: 5000 })
      
      if(snackbarMessage.actionFunction !== undefined) {
      }
      snackBarRef.onAction().subscribe(snackbarMessage.actionFunction);
    }
  }

  // component Output interfaces 
  @Output() addStudentEmitter = new EventEmitter<Student>()
  @Output() removeStudentsEmitter = new EventEmitter<Student[]>()
  @Output() reloadStudentsListEmitter = new EventEmitter<void>()

  courseId: string

  ngOnInit(): void {
    this.courseId = this.route.snapshot.parent.url[1].toString()
    //console.dir("courseId: " + this.courseId)
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort /* apply sort (MatSort) to sort automatically the data sousce on sort changes */  
    this.dataSource.paginator = this.paginator
  }

  getShownStudents() {
    /* this function return the list of shown students */
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize
    const endIndex = startIndex + this.paginator.pageSize
    const shownStudents = this.dataSource.data.slice(startIndex, endIndex)
    // console.dir(shownStudents)
    return shownStudents
  }

  toggleTableRow(row: Student) {
    return this.selectionModel.toggle(row);
  }

  toggleTableMaster() {
    if(this.getCurrentPageSelectedStudentsNumber() !== 0) {
      // at least one student in the current page is selected --> remove current page students selection
      const shownStudents = this.getShownStudents()
      shownStudents.forEach( student => {
        if(this.selectionModel.isSelected(student)) {
          this.selectionModel.toggle(student)
        }
      })
      this.masterCheckbox.checked = false
    } else {
      /* no students are selected in the current page --> select all */
      this.selectAllCurrentPageStudents()
    }
  }

  getCurrentPageSelectedStudentsNumber() {
    /* return the number of students selected in the current page */
    let i: number
    const shownStudents = this.getShownStudents()
    let nSelectedStudents: number = 0
    shownStudents.forEach( (student: Student) => {
      if(this.selectionModel.isSelected(student)) nSelectedStudents++
    })
    
    return nSelectedStudents
  }

  areAllCurrentPageStudentsSelected() {
    if(this.dataSource.data.length === 0) return false; // return false if there are no data in the table

    /* it returns whether all students in the current page are selected */
    let shownStudents: Student[] = this.getShownStudents()

    for(let i=0; i<shownStudents.length; i++) {
      if(!this.selectionModel.isSelected(shownStudents[i])) {
        // at least one shown student is not selected --> return false!
        // console.dir("areAllCurrentPageStudentsSelected: false")
        return false
      }
    }
    // all shown students are selected --> return true!
    // console.dir("areAllCurrentPageStudentsSelected: true")
    return true
  }

  areAllStudentsSelected() {
    if(this.dataSource.data.length === 0) return false; // return false if there are no data in the table
    // check if all students are selected
    const data = this.dataSource.data
    for(let i=0; i<data.length; i++) {
      if(!this.selectionModel.isSelected(data[i])) {
        // at least one student is not selected --> return false!
        // console.dir("areAllStudentsSelected: false")
        return false
      }
    }
    // all students are selected --> return true!
    // console.dir("areAllStudentsSelected: true")
    return true;
  }

  areStudentsSelected() {
    /* check if there is at least one student in the selectionModels 
       --> used to enable/disble delete button in the GUI */
    return this.selectionModel.hasValue()
  }

  selectAllCurrentPageStudents() {
    const shownStudents = this.getShownStudents()
    shownStudents.forEach((student: Student) => {
      if(!this.selectionModel.isSelected(student))
        this.selectionModel.toggle(student)
      })
  }

  selectAllStudents() {
    let i: number
    const data = this.dataSource.data
    for(i=0; i<data.length; i++) {
      if(!this.selectionModel.isSelected(data[i])) {
        this.selectionModel.toggle(data[i])
      }
    }
  }

  clearAllSelections() {
    this.selectionModel.clear()
  }

  removeSelectedRows() {
    // remove all the student selected
    this.removeStudentsEmitter.emit(this.selectionModel.selected);
    this.selectionModel.clear()
  }

  filter(filterValue: string = '') {
    filterValue = filterValue.trim(); // remove whitespace
    filterValue = filterValue.toLowerCase();
    //console.dir("'" + filterValue + "'");
    this._filteredStudents = this._unenrolledStudents
                        .filter( s => {
                          return filterValue === '' ? true : s.toString().toLowerCase().includes(filterValue) 
                        });
  }

  updateAddSelection(event: MatAutocompleteSelectedEvent) {
    this.addStudentSelection = (event && event.option) ? event.option.value : null;
  }

  addStudent() {
    this.addStudentEmitter.emit(this.addStudentSelection);
    this.addStudentSelection = null; // reset selection
  }

  enrollStudentsCSV() {
    const dialogConfig = new MatDialogConfig()
    dialogConfig.autoFocus = false
    dialogConfig.width = "500px"
    dialogConfig.height = "auto"
    dialogConfig.maxHeight = "500px"
    dialogConfig.data = {
      students: this._unenrolledStudents,
      courseId: this.courseId
    }

    const dialogRef = this.matDialog.open(EnrollStudentsCsvDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(res => {
      if(res) {
        //console.dir("enrollStudentsCSV() - success ");
        this.reloadStudentsListEmitter.emit()
      } else {
        // user pressed cancel
      }
    })

  }

}
