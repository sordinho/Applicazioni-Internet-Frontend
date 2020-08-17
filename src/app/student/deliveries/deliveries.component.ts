import {Component, OnInit} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {Assignment} from '../../models/assignment.model';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {Paper} from '../../models/paper.model';
import {Student} from '../../models/student.model';


@Component({
    selector: 'app-deliveries',
    templateUrl: './deliveries.component.html',
    styleUrls: ['./deliveries.component.css'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({height: '0px', minHeight: '0'})),
            state('expanded', style({height: '*'})),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
})
export class DeliveriesComponent implements OnInit {

    columnsToDisplay = ['id'].concat('releaseDate', 'expireDate', 'download');
    dataSource: MatTableDataSource<Assignment>;
    expandedElement: Assignment | null;

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

    constructor() {
    }

    ngOnInit(): void {
        this.dataSource = new MatTableDataSource<Assignment>(this.assignments);
    }

    downloadAssignment(event: any, assignment: any) {
        event.stopPropagation();
        console.log('Download: ' + assignment);
    }

    uploadTask(assignment: any) {
        console.log('Upload: ' + assignment);
    }

    downloadDelivered(paper: Paper) {
        console.log('Download: ' + paper.id + ' ' + paper.status);
    }
}
