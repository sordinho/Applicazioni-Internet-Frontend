import {Component, OnInit, ViewChild} from '@angular/core';
import {Vm} from '../../models/vm.model';
import {MatAccordion} from '@angular/material/expansion';
import {VmService} from '../../services/vm.service';
import {MatDialog} from '@angular/material/dialog';
import {ShareDialogComponent} from './share-dialog.component';
import {CreateVmDialogComponent} from './create-vm-dialog.component';
import {Team, TEST_GROUP} from '../../models/team.model';
import {StudentService} from '../../services/student.service';
import {GroupService} from '../../services/group.service';
import {AuthService} from '../../services/auth.service';
import {ActivatedRoute} from '@angular/router';
import {forkJoin} from 'rxjs';

@Component({
    selector: 'app-vm',
    templateUrl: './vm.component.html',
    styleUrls: ['./vm.component.css']
})
export class VmComponent implements OnInit {

    team: Team;
    teamFetched: boolean = false;
    vms: Vm[] = [];
    courseId: string;


    @ViewChild('vmsAccordion') accordion: MatAccordion;

    constructor(private vmService: VmService, private studentService: StudentService, private groupService: GroupService,
                private authService: AuthService,
                private route: ActivatedRoute,
                private shareDialog: MatDialog, private createVmDialog: MatDialog) {
    }

    ngOnInit(): void {
        this.team = new Team('-1');
        this.courseId = this.route.snapshot.parent.url[1].toString();
        this.initStudentGroup();
    }

    openAll() {
        this.accordion.openAll();
    }

    closeAll() {
        this.accordion.closeAll();
    }

    connectToVm(vm: Vm) {
        console.log('Connect to vm: ' + vm.id);
        // todo set vm status running
        window.open('https://www.google.com');
    }

    initStudentGroup() {
        this.studentService.getTeamByCourse(this.authService.getUserId(), this.courseId).subscribe((t: Team) => {
            this.teamFetched = true;
            if (t != null) {
                this.team = t;
                let members$ = this.groupService.getMembers(this.team.id);
                let resources$ = this.groupService.getResources(this.team.id);
                let vms$ = this.groupService.getVms(this.team.id);
                forkJoin([members$, resources$, vms$]).subscribe(data => {
                    this.team.members = data[0];
                    this.team.resources = data[1];
                    this.vms = data[2];

                    // get owners and creator info about all the vms
                    this.vms.forEach((vm) => {
                        let creator$ = this.studentService.find(vm.creatorId);
                        let owners$ = this.vmService.getVmOwners(vm.id);
                        forkJoin([creator$, owners$]).subscribe(data => {
                            vm.creator = data[0];
                            vm.owners = data[1];
                        });
                    });
                });
            }
        });
    }

    deleteVM(vm: Vm) {
        console.log('Delete vm: ' + vm.id);
    }

    stopVm(vm: Vm) {
        console.log('Stop vm: ' + vm.id);
        vm.status = 'OFF';
    }

    startVm(vm: Vm) {
        console.log('Start vm: ' + vm.id);
        vm.status = 'RUNNING';
    }

    shareVm(vm: Vm) {
        this.shareDialog.open(ShareDialogComponent, {
            width: '50%',
            data: {
                group: this.team,
                vm: vm
            }
        });
    }

    studentIsOwner(vm: Vm) {
        // TODO check if actual user is owner of the given VM
        return true;
    }

    createNewVm() {
        this.createVmDialog.open(CreateVmDialogComponent, {
            data: {
                group: this.team,
                vms: this.vms
            }
        });
    }
}
