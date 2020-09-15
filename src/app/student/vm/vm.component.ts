import {Component, OnInit, ViewChild} from '@angular/core';
import {Vm} from '../../models/vm.model';
import {MatAccordion} from '@angular/material/expansion';
import {VmService} from '../../services/vm.service';
import {MatDialog} from '@angular/material/dialog';
import {ShareDialogComponent} from './share-dialog.component';
import {CreateVmDialogComponent} from './create-vm-dialog.component';
import {Team} from '../../models/team.model';
import {StudentService} from '../../services/student.service';
import {GroupService} from '../../services/group.service';
import {AuthService} from '../../services/auth.service';
import {ActivatedRoute} from '@angular/router';
import {forkJoin} from 'rxjs';
import {CourseService} from '../../services/course.service';
import {VmModel} from '../../models/vmModel.model';
import {VmModelService} from '../../services/vm-model.service';
import {ConfigurationModel} from '../../models/configuration.model';
import {ConfigurationService} from '../../services/configuration.service';
import {MatSnackBar} from '@angular/material/snack-bar';


@Component({
    selector: 'app-vm',
    templateUrl: './vm.component.html',
    styleUrls: ['./vm.component.css']
})
export class VmComponent implements OnInit {

    team: Team;
    teamFetched: boolean = false;
    vmDataFetched: number = 0;
    teamHasConfigValid: boolean = false;
    allDataFetched: boolean = false;
    vms: Vm[] = [];
    courseId: string;
    vmModel: VmModel;
    allocatedCPU = 0;
    allocatedDisk = 0;
    allocatedRam = 0;
    configuration: ConfigurationModel = null;


    @ViewChild('vmsAccordion') accordion: MatAccordion;

    constructor(private vmService: VmService, private studentService: StudentService, private groupService: GroupService,
                private courseService: CourseService, private vmModelService: VmModelService, private configurationService: ConfigurationService,
                private authService: AuthService,
                private route: ActivatedRoute,
                private shareDialog: MatDialog, private createVmDialog: MatDialog, private snackBar: MatSnackBar) {
    }

    ngOnInit(): void {
        this.allDataFetched = false;
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
        let win = window.open('', 'VM ' + vm.id, 'width=1280, height=720, status=no, toolbar=no, menubar=no, location=no, addressbar=no');
        win.document.title = 'VM ' + vm.id;
        win.document.write('<head><title>VM ' + vm.id + '</title></head><body><img src="http://localhost:4200/assets/images/' + this.vmModel.id + '.png" style="max-width: 100%; height: auto;"></body>');
        win.document.close();
    }

    initCourseData() {
        this.courseService.find(this.courseId).subscribe((course) => {
            if (course.vmModelLink !== null) {
                this.vmModelService.getModelInfoByDirectLink(course.vmModelLink).subscribe((data) => {
                    this.vmModel = data;
                });
            }
        }, error => {
            this.snackBar.open('Unable to fetch course data. Please refresh the page', null, {duration: 5000});
        });
    }

    initStudentGroup() {
        this.studentService.getTeamByCourse(this.authService.getUserId(), this.courseId).subscribe((t: Team) => {
            this.teamFetched = true;

            this.team = t;
            let members$ = this.groupService.getMembers(this.team.id);
            let resources$ = this.groupService.getResources(this.team.id);
            if (this.team.configurationLink) {
                this.configurationService.getConfigurationByLink(this.team.configurationLink).subscribe((data) => {
                        this.configuration = data;
                        this.teamHasConfigValid = true;
                    }, error => {
                        this.snackBar.open('Unable to fetch resources data. Please refresh the page', null, {duration: 5000});
                    }
                );
                this.initVmsData();
                forkJoin([members$, resources$]).subscribe(data => {
                    this.team.members = data[0];
                    this.team.resources = data[1];
                    this.allDataFetched = true;
                });
            } else {
                this.allDataFetched = true;
            }

        }, (error) => {
            this.team = null;
            this.allDataFetched = true;
        });
    }

    initVmsData() {
        this.vmDataFetched = 0;
        this.vms = [];
        this.groupService.getVms(this.team.id).subscribe((data) => {
            this.vms = data;
            this.updateAllocatedResources();

            // get owners info about all the vms
            this.vms.forEach((vm) => {
                this.vmService.getVmOwners(vm.id)
                    .subscribe((students) => {
                        vm.owners = students;
                        this.vmDataFetched++;
                        console.log('owner: ' + vm.owners);
                    });
            });
        }, error => {
            this.snackBar.open('Unable to fetch VMs data. Please refresh the page', null, {duration: 5000});
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
        this.vmService.deleteVm(vm.id).subscribe(() => {
            this.snackBar.open('Vm ' + vm.id + ' Deleted', null, {duration: 5000});
            this.refreshTeamResources();
            this.initVmsData();
        }, error => {
            this.snackBar.open('Error deleting vm ' + vm.id, null, {duration: 5000});
            this.refreshTeamResources();
            this.initVmsData();
        });
    }

    stopVm(vm: Vm) {
        console.log('Stop vm: ' + vm.id);
        this.vmService.stopVm(vm.id).subscribe(data => {
            vm.status = 'OFF';
            this.refreshTeamResources();
        });

    }

    startVm(vm: Vm) {
        console.log('Start vm: ' + vm.id);
        this.vmService.startVm(vm.id).subscribe(data => {
            vm.status = 'ON';
            this.refreshTeamResources();
        }, error => {
            this.snackBar.open('Error starting vm ' + vm.id, null, {duration: 5000});
        });
    }

    shareVm(vm: Vm) {
        this.shareDialog.open(ShareDialogComponent, {
            width: '50%',
            data: {
                group: this.team,
                vm: vm
            }
        }).afterClosed().subscribe((res) => {
            if (res === 'OK') {
                this.initVmsData();
                this.snackBar.open('Vm shared', null, {duration: 5000});
            } else {
                this.snackBar.open('Error sharing vm', null, {duration: 5000});
            }
            console.log('CLOSED');
        });
    }

    studentIsOwner(vm: Vm) {
        let actualOwners: string[] = vm.owners.map((s) => {
            return s.id;
        });
        return actualOwners.includes(this.authService.getUserId());
    }

    createNewVm() {
        this.createVmDialog.open(CreateVmDialogComponent, {
            data: {
                group: this.team,
                vms: this.vms,
                vmModel: this.vmModel.uniqueId,
                creatorId: this.authService.getUserId(),
                configuration: this.configuration,
                action: 'CREATE'
            }
        }).afterClosed().subscribe((res) => {
            if (res === 'OK') {
                this.refreshTeamResources();
                this.initVmsData();
                this.snackBar.open('Vm created', null, {duration: 5000});
            } else {
                this.snackBar.open('Error creating vm', null, {duration: 5000});
            }
            console.log('CLOSED');
        });
    }

    vmIsEditable(vm: Vm) {
        return (vm.status === 'OFF' && this.studentIsOwner(vm));
    }

    updateVm(vm: Vm) {
        this.createVmDialog.open(CreateVmDialogComponent, {
            data: {
                group: this.team,
                vms: this.vms.filter(value => value != vm),
                vmModel: this.vmModel.uniqueId,
                creatorId: this.authService.getUserId(),
                configuration: this.configuration,
                action: 'UPDATE',
                vmToUpdate: vm
            }
        }).afterClosed().subscribe((res) => {
            if (res === 'OK') {
                this.refreshTeamResources();
                this.initVmsData();
                this.snackBar.open('Vm updated', null, {duration: 5000});
            } else {
                this.snackBar.open('Error updating vm', null, {duration: 5000});
            }
            console.log('CLOSED');
        });
    }

    refreshTeamResources() {
        this.groupService.getResources(this.team.id).subscribe((data) => {
            this.team.resources = data;
        });
    }

}
