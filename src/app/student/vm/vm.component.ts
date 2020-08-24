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
import {CourseService} from '../../services/course.service';
import {VmModel} from '../../models/vmModel.model';
import {VmModelService} from '../../services/vm-model.service';

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
    vmModelId: string;
    allocatedCPU = 0;
    allocatedDisk = 0;
    allocatedRam = 0;


    @ViewChild('vmsAccordion') accordion: MatAccordion;

    constructor(private vmService: VmService, private studentService: StudentService, private groupService: GroupService,
                private courseService: CourseService, private vmModelService: VmModelService,
                private authService: AuthService,
                private route: ActivatedRoute,
                private shareDialog: MatDialog, private createVmDialog: MatDialog) {
    }

    ngOnInit(): void {
        this.team = new Team('-1');
        this.courseId = this.route.snapshot.parent.url[1].toString();
        this.initCourseData();
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

    initCourseData() {
        this.courseService.find(this.courseId).subscribe((course) => {
            if (course.vmModelLink !== null) {
                // vm model is selected for the current group
                // this.vmModelService.getModelInfoByDirectLink(course.vmModelLink).subscribe((model) => {
                //     this.vmModel = model;
                // });
                this.vmModelId = course.vmModelLink.split('virtual-machine-models/')[1];
                console.log(this.vmModelId);
            }
        });
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
                    this.updateAllocatedResources();
                    // get owners and creator info about all the vms
                    this.vms.forEach((vm) => {

                        // let creator$ = this.studentService.find(vm.creatorId);
                        // let owners$ =
                        this.vmService.getVmOwners(vm.id)
                            // forkJoin([creator$, owners$]).
                            .subscribe(data => {
                                // vm.creator = data[0];
                                vm.owners = data;
                                // console.log('creator: ' + vm.creator);
                                console.log('owner: ' + vm.owners);
                            });
                    });
                });
            }
        });
    }

    updateAllocatedResources() {
        if (this.vms.length !== 0) {
            const reducer = (accumulator, currentValue) => accumulator + currentValue;
            this.allocatedCPU = this.vms.map(vm => vm.num_vcpu).reduce(reducer);
            this.allocatedRam = this.vms.map(vm => vm.ram).reduce(reducer);
            this.allocatedDisk = this.vms.map(vm => vm.disk_space).reduce(reducer);
        }
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
                vms: this.vms,
                vmModel: this.vmModelId,
                creatorId: this.authService.getUserId(),
            }
        }).afterClosed().subscribe(() => {
            this.groupService.getVms(this.team.id).subscribe((data) => {
                this.vms = data;
                console.log('CLOSED');
            });
        });
    }
}
