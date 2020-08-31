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
import {ActivatedRoute} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {catchError} from 'rxjs/operators';
import {Course} from '../../models/course.model';

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
    courseId: string = '';
    course: Course = null;


    @ViewChild(MatSort, {static: true}) sort: MatSort;
    @ViewChild(MatAccordion) accordion: MatAccordion;

    @ViewChild(MatPaginator) set matPaginator(paginator: MatPaginator) {
        this.dataSource.paginator = paginator;
    }

    constructor(private groupService: GroupService, private studentService: StudentService, private courseService: CourseService,
                private authService: AuthService, private route: ActivatedRoute, private snackBar: MatSnackBar) {
    }

    ngOnInit(): void {
        this.courseId = this.route.snapshot.parent.url[1].toString();
        this.courseService.find(this.courseId).subscribe((data) => {
            this.course = data;
        });
        this.dataSource = new MatTableDataSource<Student>([]);
        this.initStudentTeam();
        this.initStudentsWithoutTeam();
    }

    initStudentTeam() {
        this.studentService.getTeamByCourse(this.authService.getUserId(), this.courseId).subscribe((team: Team) => {
            this.team = team;
            this.dataReady = true;
            console.log('Team: ' + team);
            if (team == null) {
                console.log('team nullo');
                this.initTeamProposals();
                return;
            }
            this.groupService.getMembers(team.id).subscribe(data => {
                this.team.members = data;
            });
        });
    }

    initTeamProposals() {
        this.studentService.getUnconfirmedTeamsByCourse(this.authService.getUserId(), this.courseId).subscribe((teams: Team[]) => {
            this.proposals = teams;
            this.proposals.forEach((team: Team) => {
                this.groupService.getMembersStatus(team.id).subscribe((data: Student[]) => {
                    team.members = data;
                    for (let student of team.members) {
                        if (student.status === 'PROPONENT') {
                            team.proposer = student;
                        }
                    }
                });
            });
        });
    }

    initStudentsWithoutTeam() {
        this.courseService.queryAvailableStudents(this.courseId).subscribe((data: Student[]) => {
            let filtered: Student[] = data.filter((s: Student) => s.id != this.authService.getUserId());
            this.dataSource = new MatTableDataSource<Student>(filtered);
        });
    }

    toggleTableRow(event: MatCheckboxChange, row: Student) {
        const ret = this.selectionModel.toggle(row);
        return ret;
    }

    proposeGroup() {
        let expiry = moment(this.expiryProposal.value, 'YYYY-MM-DD');
        let members: string[] = this.selectionModel.selected.map((student) => student.id);
        this.courseService.createTeam(this.courseId, this.proposedGroupName.value, members, this.authService.getUserId(), expiry.format('DD/MM/YYYY'))
            .subscribe((proposed: Team) => {
                    this.snackBar.open('New Team proposed', '', {duration: 5000});
                    this.resetTeamProposalForm();
                    this.initTeamProposals();
                },
                (err) => {
                    this.snackBar.open('Error creating new proposal', null, {duration: 5000});
                }
            );
    }

    disableProposalForm() {
        // Return true if proposal button need to be disabled
        return this.proposedGroupName.value === null || this.proposedGroupName.value === '' || this.selectionModel.selected.length === 0
            || this.expiryProposal === null || this.expiryProposal.value === ''
            || !moment(this.expiryProposal.value, 'YYYY-MM-DD', true).isValid()
            || this.selectionModel.selected.length < this.course.min || this.selectionModel.selected.length > this.course.max;
    }

    resetTeamProposalForm() {
        this.expiryProposal.reset();
        this.proposedGroupName.reset();
        this.selectionModel.clear();
    }

}
