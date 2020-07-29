import { Component, Input, ViewChild, AfterViewInit, EventEmitter, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Student } from '../../models/student.model';
import { MatSort } from '@angular/material/sort';
import { MatCheckboxChange, MatCheckbox } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements AfterViewInit {

  /* array of selectionModel --> the array index is the page (paginator) and have the selected student of that page */  
  selectionModels: SelectionModel<Student>[] = new Array()  

  dataSource: MatTableDataSource<Student>

  addStudentSelection: Student = null;

  colsToDisplay = ['select'].concat('serial', 'name', 'firstName', 'group');

  // ViewChilds
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('auto') auto: MatAutocomplete;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild('masterCheckbox') private masterCheckbox: MatCheckbox;

  _students: Student[];
  _filteredStudents: Student[];
  _enrolledStudents: Student[];

  // paginator info
  pageSize: number; 
  pageIndex: number; 

  // component Input interfaces 
  @Input() set students(allStudents: Student[]) {
    this._students = allStudents;
    this._filteredStudents = allStudents.filter( (student) => student.courseId !== "1" );
    //console.dir("_filteredStudents" + this._filteredStudents);
  }
  @Input() set enrolledStudents(students: Student[]) {
    this._enrolledStudents = students;
    if(this.dataSource != undefined) {
      this.dataSource.data = students;
    } else {
      this.dataSource = new MatTableDataSource<Student>(students);
    }
  }

  // component Output interfaces 
  @Output() addStudentsEmitter = new EventEmitter<Student[]>();
  @Output() removeStudentsEmitter = new EventEmitter<Student[]>();
  
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    this.pageSize = this.paginator.pageSize; 
    this.pageIndex = this.paginator.pageIndex; 
  }

  toggleTableRow(event: MatCheckboxChange, row: Student) {
    if(this.selectionModels[this.pageIndex] == null) {
      // console.dir("creating new selectionModel")
      // there isn't the selectionModel for the current pageIndex!
      this.selectionModels[this.pageIndex] = new SelectionModel<Student>(true, [])
    } else {
      //console.dir("selectionModel already exists")
    }
    return this.selectionModels[this.pageIndex].toggle(row)
  }

  toggleTableMaster(event: MatCheckboxChange) {
    if(this.selectionModels[this.paginator.pageIndex] != null && 
        !this.selectionModels[this.paginator.pageIndex].isEmpty()) {
      // all the student in the current page are selected --> remove current page students selection
      this.selectionModels[this.paginator.pageIndex].clear() 
      if(this.masterCheckbox.checked) this.masterCheckbox.checked = false
    } else {
      this.selectAllPageStudents()
    }
  }

  selectAllPageStudents() {
    var start = this.pageIndex * this.pageSize;
    var end: number; 

    if(this.pageIndex == this.paginator.getNumberOfPages()-1) {
      //console.dir("Sono in ultima pagina");
      end = this.paginator.length;
    } else {
      //console.dir("Non sono in ultima pagina");
      end = start+this.pageSize;
    }

    if(this.selectionModels[this.pageIndex] == null) this.selectionModels[this.pageIndex] = new SelectionModel<Student>(true, [])
    //console.dir("seleziono gli studenti nella pagina corrente (agli indici): ");
    for(let i=start; i < end; i++) {
      //console.dir(i);
      //console.dir("student: " + this.dataSource.data[i].id);
      this.selectionModels[this.pageIndex].select(this.dataSource.data[i]);
    }
  }

  selectAllStudents() {
    let i: number
    let j: number
    let studentIndex: number = 0
    var nStudentsPage: number;


    for(i=0; i<this.paginator.getNumberOfPages(); i++) {
      if(this.selectionModels[i] == null) {
        //console.dir("creating new selectionModel")
        // there isn't the selectionModel for the current pageIndex!
        this.selectionModels[i] = new SelectionModel<Student>(true, [])
      }
    
      // compute number of students for each page
      if(i == this.paginator.getNumberOfPages()-1) {
        // last page
        nStudentsPage = this.paginator.length - (this.paginator.getNumberOfPages()-1)*this.paginator.pageSize
      } else {
        nStudentsPage = this.paginator.pageSize
      }
      
      for(j=0; j<nStudentsPage; j++) {  
        if(!this.selectionModels[i].isSelected(this._enrolledStudents[studentIndex])) {
          //console.dir("selecting stud #" + studentIndex + " firstName: " + this._enrolledStudents[studentIndex].firstName)
          this.selectionModels[i].toggle(this._enrolledStudents[studentIndex])
        }
        studentIndex++;
      }
    }
    //console.dir("all studs sel: " + this.areAllStudentsSelected());
  }

  clearAllSelections() {
    this.selectionModels = []
  }

  areAllPageStudentsSelected() {
    // check if all students (in the current page) are selected
    const nSelected = this.selectionModels[this.pageIndex] != null ? this.selectionModels[this.pageIndex].selected.length : 0  
    var nStudentsPage: number;
    
    if(this.pageIndex == this.paginator.getNumberOfPages()-1) {
      // last page
      nStudentsPage = this.paginator.length - (this.paginator.getNumberOfPages()-1)*this.paginator.pageSize
    } else {
      nStudentsPage = this.paginator.pageSize
    }
    //console.dir("nStudentsPage: " + nStudentsPage);
    //console.dir("nSelected: " + nSelected)
    // console.dir("areAllPageStudentsSelected() : " + (nSelected == nStudentsPage))

    return nSelected == nStudentsPage
  }

  areAllStudentsSelected() {
    // check if all students are selected
    let i: number
    var nSelectedStudents: number = 0
    for(i=0; i<this.paginator.getNumberOfPages(); i++) {
      if(this.selectionModels[i] != null && this.selectionModels[i].hasValue()) {
        nSelectedStudents += this.selectionModels[i].selected.length
      }
    }

    return nSelectedStudents == this._enrolledStudents.length
  }

  areStudentsSelected() {
    //console.dir("areStudentsSelected()")
    for(var i=0; i<this.selectionModels.length; i++) {
      if(this.selectionModels[i] != null && !this.selectionModels[i].isEmpty()) {
        return true
      }
    }
  }

  removeSelectedRows() {
    // remove all the student selected in the current page
    //console.dir("students.ts - studentRemoveEmitter(student: " + this.selectionModel.selected + ")");
    for(var i = 0; i < this.selectionModels.length; i++) { 
      this.removeStudentsEmitter.emit(this.selectionModels[i].selected);
      this.selectionModels[i] = new SelectionModel<Student>(true, []); // reset selectionModel*/
    }

  }

  displayFn(student: Student) {
    return student.toString();
  }

  filter(filterValue: string = '') {
    filterValue = filterValue.trim(); // remove whitespace
    filterValue = filterValue.toLowerCase();
    //console.dir("'" + filterValue + "'");
    this._filteredStudents = this._students
                        .filter( s => {
                          return filterValue === '' ? true : s.toString().toLowerCase().includes(filterValue) 
                        });
  }

  updateAddSelection(event: MatAutocompleteSelectedEvent) {
    this.addStudentSelection = (event && event.option) ? event.option.value : null;
  }

  addStudent() {
    this.addStudentsEmitter.emit([this.addStudentSelection]);
    this.addStudentSelection = null; // reset selection
    // this._students = this._students; // reset options
    this._filteredStudents = this._filteredStudents.filter(student => student !== this.addStudentSelection)
  }
 
  pageEvent(event) {
    /*
    console.dir("pageEvent(event) ");
    console.dir("----------");
    console.dir("(before event) index: " + this.pageIndex + " size: " + this.pageSize)
    */
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    /*
    console.dir("(after event) index: " + this.pageIndex + " size: " + this.pageSize)
    console.dir("----------");
    console.dir("event.length = " + event.length);
    console.dir("paginator.length: " + this.paginator.length);
    console.dir("----------");
    console.dir("paginator.getNumberOfPages(): " + this.paginator.getNumberOfPages());
    console.dir("----------");
    */
  }
}
