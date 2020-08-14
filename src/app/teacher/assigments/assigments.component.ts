import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
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
  
  assignments: Assignment[] = [
    new Assignment("A0",  "01/01/2020", "31/01/2020", null), 
    new Assignment("A1",  "01/03/2020", "31/03/2020", null)
  ]

  papers = new Map<string, Paper[]>([
    ["A0", [ new Paper("P0", new Student("902030", "260342", "Andrea", "Rossi"), "15/01/2020", "null", null, null, null),
             new Paper("P1", new Student("902030", "260342", "Francesco", "Verdi"), "10/01/2020", "null", null, null, null),
             new Paper("P2", new Student("902030", "260342", "Stefano", "Gialli"), "12/01/2020", "null", null, null, null) ]],
    ["A1", [ new Paper("P0", new Student("902030", "260342", "Andrea", "Rossi"), "15/01/2020", "null", null, null, null),
             new Paper("P1", new Student("902030", "260342", "Francesco", "Verdi"), "10/01/2020", "read", null, null, null),
             new Paper("P2", new Student("902030", "260342", "Stefano", "Gialli"), "12/01/2020", "read", null, null, null),
             new Paper("P3", new Student("902022", "260332", "Simone", "Gallo"), "10/01/2020", "delivered", null, null, null) ]]
  ]) 

  expandedPaper: Paper | null;

  status_list = [ "null", "read", "delivered", "revised" ];

  /* selectedStatus used to keep track of selected status */
  selectedStatus: SelectionModel<string> = new SelectionModel<string>(true, [])

  // select last assignment as default
  selectedAssignment: string = this.assignments[this.assignments.length-1].id 

  dataSource: MatTableDataSource<Paper>
  
  colsToDisplay = ['lastName', 'firstName', 'id', 'status', 'published']

  @ViewChild('masterCheckbox') private masterCheckbox: MatCheckbox

  constructor(private matDialog: MatDialog) { 
    this.dataSource = new MatTableDataSource<Paper>(this.papers.get(this.selectedAssignment))
  }

  ngOnInit(): void {
  }

  onSelectChange() {
    //console.dir("this.selectedAssignment: " + this.selectedAssignment)
    this.dataSource = new MatTableDataSource<Paper>(this.papers.get(this.selectedAssignment))
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
      filteredPapers = this.papers.get(this.selectedAssignment) 
    } else {
      // filter papers by their status
      filteredPapers = this.papers.get(this.selectedAssignment).filter((paper: Paper) => {
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

}
