import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {GroupService} from '../../services/group.service';
import {SelectionModel} from '@angular/cdk/collections';
import {Student} from '../../models/student.model';
import {MatTableDataSource} from '@angular/material/table';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {FormControl} from '@angular/forms';
import * as moment from 'moment';
import {MatAccordion} from '@angular/material/expansion';
import {StudentService} from 'src/app/services/student.service';
import {forkJoin} from 'rxjs';
import {Team, TEST_GROUP} from '../../models/team.model';
import {CourseService} from '../../services/course.service';

@Component({
    selector: 'app-groups',
    templateUrl: './groups.component.html',
    styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit {

    team: Team = null;
    dataReady = false;
    selectionModel: SelectionModel<Student> = new SelectionModel<Student>(true, []);
    dataSource: MatTableDataSource<Student>;
    colsToDisplay = ['select'].concat('id', 'lastName', 'firstName');
    proposedGroupName = new FormControl();
    expiryProposal = new FormControl();
    proposals = []; // [TEST_GROUP, TEST_GROUP];

    @ViewChild(MatSort, {static: true}) sort: MatSort;
    @ViewChild(MatPaginator) set matPaginator( paginator: MatPaginator){
        this.dataSource.paginator = paginator;
    }
    @ViewChild('vmsAccordion') accordion: MatAccordion;

    constructor(private groupService: GroupService, private studentService: StudentService, private courseService: CourseService) {
    }

    ngOnInit(): void {
        this.initStudentTeam();
        this.initStudentsWithoutTeam();
    }


    openAll() {
        this.accordion.openAll();
    }

    closeAll() {
        this.accordion.closeAll();
    }

    initStudentTeam() {
        this.studentService.getTeamByCourse('s1', 'c1').subscribe((team: Team) => {
            this.team = team;
            this.dataReady = true;
            console.log('Team: ' + team);
            if (team == null) {
                return;
            }
            let members$ = this.groupService.getMembers(team.id);
            let resources$ = this.groupService.getResources(team.id);
            forkJoin([members$, resources$]).subscribe(data => {
                this.team.members = data[0];
                this.team.resources = data[1];
            });
        });
    }

    initTeamProposals() {
// todo initialize all team proposals for the student. remember to get memebers
    }

    initStudentsWithoutTeam() {
        this.dataSource = new MatTableDataSource<Student>([]);
        this.courseService.queryAvailableStudents('c1').subscribe(data => {
            this.dataSource = new MatTableDataSource<Student>(data);
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
            || this.expiryProposal.value === '' || !moment(this.expiryProposal.value, 'YYYY-MM-DD', true).isValid();
    }

}
