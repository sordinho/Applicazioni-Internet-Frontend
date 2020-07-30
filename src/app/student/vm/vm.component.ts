import {Component, OnInit, ViewChild} from '@angular/core';
import {Group, TEST_GROUP} from '../../models/group.model';
import {Vm} from '../../models/vm.model';
import {MatAccordion} from '@angular/material/expansion';
import {VmService} from '../../services/vm.service';
import {MatDialog} from '@angular/material/dialog';
import {ShareDialogComponent} from './share-dialog.component';
import {CreateVmDialogComponent} from './create-vm-dialog.component';

@Component({
    selector: 'app-vm',
    templateUrl: './vm.component.html',
    styleUrls: ['./vm.component.css']
})
export class VmComponent implements OnInit {

    group: Group = TEST_GROUP;
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
        this.vmService.getVmsByGroupId(this.group.groupId)
            .subscribe((data) => {
                this.vms = data;
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
                group: this.group,
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
                group: this.group,
                vms: this.vms
            }
        });
    }
}
