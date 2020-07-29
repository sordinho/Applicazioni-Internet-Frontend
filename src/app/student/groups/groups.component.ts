import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {GroupService} from '../../services/group.service';
import {Group} from '../../models/group.model';
import {SelectionModel} from '@angular/cdk/collections';
import {Student} from '../../models/student.model';
import {MatTableDataSource} from '@angular/material/table';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {MatSort} from '@angular/material/sort';
import {MatAutocomplete} from '@angular/material/autocomplete';
import {MatPaginator} from '@angular/material/paginator';
import {FormControl} from '@angular/forms';
import * as moment from 'moment';

@Component({
    selector: 'app-groups',
    templateUrl: './groups.component.html',
    styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit {

    group: Group = null;
    selectionModel: SelectionModel<Student> = new SelectionModel<Student>(true, []);
    dataSource: MatTableDataSource<Student>;
    colsToDisplay = ['select'].concat('serial', 'name', 'firstName');
    proposedGroupName = new FormControl();
    expiryProposal = new FormControl();

    @ViewChild(MatSort, {static: true}) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(private groupService: GroupService) {
    }

    ngOnInit(): void {
        this.initStudentGroup();
        this.initStudentsWithoutGroup();

    }


    initStudentGroup() {
        this.groupService.getStudentGroup('1234', '1')
            .subscribe((data) => {
                this.group = null; //data;
            });
    }

    initStudentsWithoutGroup() {
        this.groupService.getStudentWithoutGroup('1').subscribe(data => {
            this.dataSource = new MatTableDataSource<Student>(data);
            this.dataSource.paginator = this.paginator;
        });
    }

    toggleTableRow(event: MatCheckboxChange, row: Student) {
        const ret = this.selectionModel.toggle(row);
        return ret;
    }

    proposeGroup() {
        console.log(this.proposedGroupName.value);
        console.log(this.expiryProposal.value);
    }

    disableProposalForm() {
        // Return true if proposal button need to be disabled
        return this.proposedGroupName.value === null || this.proposedGroupName.value === '' || this.selectionModel.selected.length === 0 || this.expiryProposal === null
            || this.expiryProposal.value === '' || !moment(this.expiryProposal.value, 'YYYY-MM-DD',true).isValid()
    }

}
