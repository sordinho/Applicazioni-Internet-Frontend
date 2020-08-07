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
import {AuthService} from '../../services/auth.service';

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
    proposals: Team[] = [];

    @ViewChild(MatSort, {static: true}) sort: MatSort;
    @ViewChild(MatAccordion) accordion: MatAccordion;

    @ViewChild(MatPaginator) set matPaginator(paginator: MatPaginator) {
        this.dataSource.paginator = paginator;
    }

    constructor(private groupService: GroupService, private studentService: StudentService, private courseService: CourseService, private authService: AuthService) {
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
        this.studentService.getTeamByCourse(this.authService.getUserId(), 'c1').subscribe((team: Team) => {
            this.team = team;
            this.dataReady = true;
            console.log('Team: ' + team);
            if (team == null) {
                console.log('team nullo');
                this.initTeamProposals();
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
        this.studentService.getUnconfirmedTeamsByCourse(this.authService.getUserId(), 'c1').subscribe((teams: Team[]) => {
            this.proposals = teams;
            this.proposals.forEach((team: Team) => {
                this.groupService.getMembers(team.id).subscribe(data => {
                    team.members = data;
                    console.log('Membri ' + team.id + data[0].id);
                });
            });
        });
    }

    initStudentsWithoutTeam() {
        this.dataSource = new MatTableDataSource<Student>([]);
        this.courseService.queryAvailableStudents('c1').subscribe((data: Student[]) => {
            // data.filter((s: Student) => s.id === this.authService.getUserId()); // TODO per evitare che uno studente debba selezionarsi per un gruppo
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
        let expiry = moment(this.expiryProposal.value, 'YYYY-MM-DD');
        let members: string[] = this.selectionModel.selected.map((student) => student.id);
        console.log(members);
        console.log(expiry.format());
        this.courseService.createTeam('c1', this.proposedGroupName.value, members, this.authService.getUserId(), expiry.format())
            .subscribe((proposed: Team) => {
                console.log(proposed);
            });
    }

    disableProposalForm() {
        return false;
        // Return true if proposal button need to be disabled
        return this.proposedGroupName.value === null || this.proposedGroupName.value === '' || this.selectionModel.selected.length === 0 || this.expiryProposal === null
            || this.expiryProposal.value === '' || !moment(this.expiryProposal.value, 'YYYY-MM-DD', true).isValid();
    }

}
