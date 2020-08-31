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
  
  expandedPaper: Paper | null;

  status_list = [ "NULL", "READ", "DELIVERED", "REVISED" ]

  /* selectedStatus used to keep track of selected status */
  selectedStatus: SelectionModel<string> = new SelectionModel<string>(true, [])

  dataSource: MatTableDataSource<Paper>
  
  selectedAssignment: string

  _assignments: Assignment[]
  _papers: Paper[]  
  _papersHistory: Paper[] = []

  // component Input interfaces 
  @Input() set assignments(assignments: Assignment[]) {
    if(assignments !== undefined && assignments !== null) {
      this._assignments = assignments
      if(this.selectedAssignment === undefined && this._assignments.length>0) {
        // select last assignment as default)
        this.selectedAssignment = this._assignments[this._assignments.length-1].id 
        this.getPapersEmitter.emit(this.selectedAssignment)
      }
    }
  }

  @Input() set papers(papers: Paper[]) {
    if(papers !== undefined) {
      this._papers = papers
      this.dataSource = new MatTableDataSource<Paper>(papers)
    }
  }  

  /* papers history of the expanded student (papers) */ 
  @Input() set papersHistory(papersHistory: Paper[]) {
    if(papersHistory !== undefined) {
      this._papersHistory = papersHistory
    }
  }  
  
  // component Output interfaces 
  @Output() getPapersEmitter = new EventEmitter<string>()
  @Output() getPapersHistoryEmitter = new EventEmitter<{assignmentId: string, studentId: string}>()

  colsToDisplay = ['lastName', 'firstName', 'id', 'status', 'published']

  @ViewChild('masterCheckbox') private masterCheckbox: MatCheckbox

  constructor(private matDialog: MatDialog) {}

  ngOnInit(): void {
  }

  onSelectChange() {
    //console.dir("this.selectedAssignment: " + this.selectedAssignment)
    this.getPapersEmitter.emit(this.selectedAssignment)
    /* reset status filter */
    this.selectedStatus.clear()
    /* reset the expanded paper (if any) */
    this.expandedPaper = null
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
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = "500px";

    const dialogRef = this.matDialog.open(UploadCorrectionDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(res => {
      if(res) {
        //console.dir("uploadCorrection() - success ");
        console.dir("uploadCorrection(paper: " + paper.id + ") - TODO") 
      } else {
        // user pressed cancel (?)
        console.dir("uploadCorrection() - unsuccess");
      }
    });
  }

  expandPaper(paper: Paper) {
    this.expandedPaper = (this.expandedPaper === paper) ? null : paper

    //console.dir("this.expandedPaper: "); console.dir(this.expandedPaper)

    this.getPapersHistoryEmitter.emit({ assignmentId: this.selectedAssignment, studentId: paper.student.id })

  }

  downloadPaper(paper: Paper) {
    console.dir("downloadPaper - TODO")
    console.dir("paper.image: " + paper.image)

  }

}
