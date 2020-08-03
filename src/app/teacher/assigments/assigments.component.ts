import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Assignment } from 'src/app/models/assignment.model';
import { Paper } from 'src/app/models/paper.model';
import { Student } from 'src/app/models/student.model';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel, SelectionChange } from '@angular/cdk/collections';
import { MatCheckbox } from '@angular/material/checkbox';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-assigments',
  templateUrl: './assigments.component.html',
  styleUrls: ['./assigments.component.css']
})
export class AssigmentsComponent implements OnInit {
  
  assignments: Assignment[] = [
    new Assignment("A0",  "01/01/2020", "31/01/2020"), 
    new Assignment("A1",  "01/03/2020", "31/03/2020"), 
    new Assignment("A2",  "01/05/2020", "31/05/2020")
  ]

  papers = new Map<string, Paper[]>([
    ["A0", [ new Paper("P0", new Student("902030", "260342", "Andrea", "Rossi"), "null", "15/01/2020"),
             new Paper("P1", new Student("902030", "260342", "Francesco", "Verdi"), "null", "10/01/2020"),
             new Paper("P2", new Student("902030", "260342", "Stefano", "Gialli"), "null", "12/01/2020") ]],
    ["A1", [ new Paper("P01", new Student("902030", "260342", "Andrea", "Rossi"), "null", "15/03/2020"),
             new Paper("P02", new Student("902030", "260342", "Francesco", "Verdi"), "read", "10/03/2020"),
             new Paper("P03", new Student("902030", "260342", "Stefano", "Gialli"), "read", "12/03/2020") ]],
    ["A2", [ new Paper("P11", new Student("902030", "260342", "Andrea", "Rossi"), "null", "15/05/2020"),
             new Paper("P12", new Student("902030", "260342", "Francesco", "Verdi"), "null", "10/05/2020") ]],
  ]) 

  status_list = [ "null", "read", "delivered", "revised" ];

  /* selectedStatus used to keep track of selected status */
  selectedStatus: SelectionModel<string> = new SelectionModel<string>(true, [])
  selectedChangeSubscription: Subscription

  // select last assignment as default
  selectedAssignment: string = this.assignments[this.assignments.length-1].id 

  dataSource: MatTableDataSource<Paper>
  
  colsToDisplay = ['name', 'firstName', 'serial', 'status', 'statusDate']

  @ViewChild('masterCheckbox') private masterCheckbox: MatCheckbox

  constructor() { 
    this.dataSource = new MatTableDataSource<Paper>(this.papers.get(this.selectedAssignment))
  }

  ngOnInit(): void {
  }

  onSelectChange() {
    //console.dir("this.selectedAssignment: " + this.selectedAssignment)
    this.dataSource = new MatTableDataSource<Paper>(this.papers.get(this.selectedAssignment))
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
          console.dir("paper.status: " + paper.status + " status: " + status)
          if(paper.status === status) return true
        }
        return false 
      })
    }

    console.dir("filteredPapers: " + filteredPapers)
    this.dataSource.data = filteredPapers    
  }

}
