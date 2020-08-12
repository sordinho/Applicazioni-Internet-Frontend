import {Component, OnInit, ViewChild} from '@angular/core';
import {Vm} from '../../models/vm.model';
import {MatAccordion} from '@angular/material/expansion';
import {VmService} from '../../services/vm.service';
import {MatDialog} from '@angular/material/dialog';
import {ShareDialogComponent} from './share-dialog.component';
import {CreateVmDialogComponent} from './create-vm-dialog.component';
import {Team, TEST_GROUP} from '../../models/team.model';

@Component({
    selector: 'app-vm',
    templateUrl: './vm.component.html',
    styleUrls: ['./vm.component.css']
})
export class VmComponent implements OnInit {

    team: Team = TEST_GROUP;
    vms: Vm[] = [];


    @ViewChild('vmsAccordion') accordion: MatAccordion;

    constructor(private vmService: VmService, private shareDialog: MatDialog, private createVmDialog: MatDialog) {
    }

    ngOnInit(): void {
        this.initGroupVms();
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


    initGroupVms() {
        this.vmService.getVmsByGroupId(this.team.id)
            .subscribe((data) => {
                this.vms = data;
            });
    }

    /*initStudentGroup() {
        this.studentService.getTeamByCourse("s1", "p").subscribe((group: Group) => {
            this.groupService.getMembers(group.id).subscribe((members: Student[]) => {
                group.members = members
                this.groupService.getResources(group.id).subscribe((resources: Resources) => {
                    group.resources = resources
                    this.group = group
                })
            })
        })
    }*/

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
