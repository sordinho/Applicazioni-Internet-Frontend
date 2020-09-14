import { Component, OnInit, ViewChild, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Assignment } from 'src/app/models/assignment.model';
import { Paper } from 'src/app/models/paper.model';
import { Student } from 'src/app/models/student.model';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel, SelectionChange } from '@angular/cdk/collections';
import { MatCheckbox } from '@angular/material/checkbox';
import { Subscription } from 'rxjs';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { UploadCorrectionDialogComponent } from 'src/app/dialogs/upload-correction-dialog/upload-correction-dialog.component';
import { NewAssignmentDialogComponent } from 'src/app/dialogs/new-assignment-dialog/new-assignment-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { Sort, MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-assigments',
  templateUrl: './assigments.component.html',
  styleUrls: ['./assigments.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AssigmentsComponent implements OnInit {

  @ViewChild('masterCheckbox') private masterCheckbox: MatCheckbox

  @ViewChild(MatSort, { static: true }) sort: MatSort

  expandedPaper: Paper | null;

  status_list = [ "NULL", "READ", "DELIVERED", "REVISED" ]

  /* selectedStatus used to keep track of selected status */
  selectedStatus: SelectionModel<string> = new SelectionModel<string>(true, [])

  dataSource: MatTableDataSource<Paper>
  
  selectedAssignment: Assignment

  courseId: string

  _assignments: Assignment[]
  _papers: Paper[]  
  _paperHistory: Paper[] = []

  papersToFetch = 0 /* manage the case in which the user change the assignment during the loading phase of the previous assignment's papers */

  // component Input interfaces 
  @Input() set assignments(assignments: Assignment[]) {
    if(assignments !== undefined && assignments !== null) {
      this._assignments = assignments
      if(this._assignments.length>0) {
        // select last assignment as default
        this.selectedAssignment = this._assignments[this._assignments.length-1] 
        this.papersToFetch++
        this.getPapersEmitter.emit(this.selectedAssignment.id)
      }
    }
  }

  @Input() set papers(papers: Paper[]) {
    if(papers !== undefined) {
      this._papers = papers
      this.papersToFetch--
      if(this.papersToFetch == 0) {
        this.dataSource = new MatTableDataSource<Paper>(papers)
        if(this.sort !== undefined) {
          this.dataSource.data = this.dataSource.sortData(this.dataSource.filteredData, this.sort)
        }
      }

    }
  }  

  /* papers history of the expanded student (papers) */ 
  @Input() set paperHistory(paperHistory: Paper[]) {
    if(paperHistory !== undefined) {
      this._paperHistory = paperHistory      
    }
  }  
  
  // component Output interfaces 
  @Output() getPapersEmitter = new EventEmitter<string>()
  @Output() getPaperHistoryEmitter = new EventEmitter<{assignmentId: string, student: Student}>()
  @Output() reloadAssignmentsEmitter = new EventEmitter<void>()


  colsToDisplay = ['lastName', 'firstName', 'id', 'status', 'published', 'score']

  constructor(private matDialog: MatDialog, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.courseId = this.route.snapshot.parent.url[1].toString()
  }

  onSelectChange() {
    if(this.selectedAssignment !== undefined) { 
      this.papersToFetch++    
      this.dataSource = null
      //console.dir("this.selectedAssignment: " + this.selectedAssignment.expired)
      this.getPapersEmitter.emit(this.selectedAssignment.id)
      /* reset status filter */
      this.selectedStatus.clear()
    }
  }

  toggleTableRow(row: string) {
    return this.selectedStatus.toggle(row);
  }

  toggleTableMaster() {
    if(!this.selectedStatus.isEmpty()) {
      // at least one status is selected --> remove selected status selection
      this.status_list.forEach( status => {
        if(this.selectedStatus.isSelected(status)) {
          this.selectedStatus.toggle(status)
        }
      })
      this.masterCheckbox.checked = false
    }else{
      /* no students are selected in the current page --> select all */
      this.status_list.forEach( status => {
        this.selectedStatus.toggle(status)
      })    
    }
  }

  areAllStatusSelected() {
    if(this.selectedStatus.selected.length === this.status_list.length) return true;
    else return false; 
  }

  filter() {
    // console.dir("filter() - selected status: " + this.selectedStatus.selected)
    let filteredPapers: Paper[]

    if(this.selectedStatus.isEmpty()) {
      // no filter --> reset dataSource (filteredPapers = all papers of the selected assignment)
      filteredPapers = this._papers 
    } else {
      // filter papers by their status
      filteredPapers = this._papers.filter((paper: Paper) => {
        for(let status of this.selectedStatus.selected) {
          //console.dir("paper.status: " + paper.status + " status: " + status)
          if(paper.status === status) return true
        }
        return false 
      })
    }

    //console.dir("filteredPapers: " + filteredPapers)
    this.dataSource.data = filteredPapers    
  }

  uploadCorrection(paper: Paper) {
    const dialogConfig = new MatDialogConfig()
    dialogConfig.autoFocus = false
    dialogConfig.width = "500px"
    dialogConfig.height = "auto"
    dialogConfig.data = {
      assignmentId: this.selectedAssignment.id,
      studentId: paper.student.id
    }

    const dialogRef = this.matDialog.open(UploadCorrectionDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(res => {
      if(res) {
        //console.dir("uploadCorrection() - success ");       
        this.dataSource = null
        this.papersToFetch++
        this.getPapersEmitter.emit(this.selectedAssignment.id)
      } else {
        // user pressed cancel (?)
        console.dir("uploadCorrection() - unsuccess");
      }
    });
  }

  expandPaper(paper: Paper) {
    this.expandedPaper = (this.expandedPaper === paper) ? null : paper

    //console.dir("this.expandedPaper: "); console.dir(this.expandedPaper)

    if(this.selectedAssignment !== undefined) {
      this.getPaperHistoryEmitter.emit({ assignmentId: this.selectedAssignment.id, student: paper.student })
    }
    
  }

  newAssignment() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "500px";
    dialogConfig.height = "auto"
    dialogConfig.autoFocus = true;
    dialogConfig.data = { 
      emitter: this.reloadAssignmentsEmitter,
      courseId: this.courseId
    }
    
    this.matDialog.open(NewAssignmentDialogComponent, dialogConfig)
  }

  sortData(sort: MatSort) {
    this.sort = sort
    this.dataSource.data = this.dataSource.sortData(this.dataSource.filteredData, sort)
  }

  downloadPaper(paper: Paper) {
    console.dir('Download Paper: ' + paper.id + ' ' + paper.status)
    console.dir('image: ')
    console.dir(paper.image)
    let date = new Date(paper.published)
    this.downloadImage(paper.image, `A${this.selectedAssignment.id}_${paper.student.id}_${date.getFullYear()}${date.getMonth()}${date.getDate()}_(${paper.id})`);
  }

  downloadImage(image: any, name: string) {
    const a = document.createElement('a'); // Create <a>
    a.href = image; // Image Base64 Goes here
    a.download = name; // File name Here
    a.click(); // Downloaded file
    a.remove();
  }

}
