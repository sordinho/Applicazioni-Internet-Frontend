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

    columnsToDisplay = ['id'].concat('releaseDate', 'expireDate');
    dataSource: MatTableDataSource<Assignment>;
    expandedElement: Assignment | null;

    assignments: Assignment[] = [
        new Assignment('A0', '01/01/2020', '31/01/2020'),
        new Assignment('A1', '01/03/2020', '31/03/2020'),
        new Assignment('A2', '01/05/2020', '31/05/2020')
    ];

    papers = new Map<string, Paper[]>([
        ['A0', [
            new Paper('P0', new Student('902030', '260342', 'Andrea', 'Rossi'), 'NULL', '15/01/2020'),
            new Paper('P0', new Student('902030', '260342', 'Andrea', 'Rossi'), 'READ', '15/01/2020'),
            new Paper('P0', new Student('902030', '260342', 'Andrea', 'Rossi'), 'COMPLETED', '15/01/2020')]],
        ['A1', [
            new Paper('P01', new Student('902030', '260342', 'Andrea', 'Rossi'), 'NULL', '15/03/2020'),
            new Paper('P01', new Student('902030', '260342', 'Andrea', 'Rossi'), 'READ', '15/03/2020'),
            new Paper('P01', new Student('902030', '260342', 'Andrea', 'Rossi'), 'COMPLETED', '15/03/2020')]],
        ['A2', [
            new Paper('P11', new Student('902030', '260342', 'Andrea', 'Rossi'), 'NULL', '15/05/2020'),
            new Paper('P11', new Student('902030', '260342', 'Andrea', 'Rossi'), 'READ', '15/05/2020')]],
    ]);

    constructor() {
    }

    ngOnInit(): void {
        this.dataSource = new MatTableDataSource<Assignment>(this.assignments);
    }

}
