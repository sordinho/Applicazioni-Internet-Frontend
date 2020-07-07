import {Component, OnInit, ViewChild} from '@angular/core';
import {Group, TEST_GROUP} from '../../models/group.model';
import {TEST_VM_UBUNTU, TEST_VM_WIN, Vm} from '../../models/vm.model';
import {MatAccordion} from '@angular/material/expansion';
import {FormControl} from '@angular/forms';
import {VmService} from '../../services/vm.service';
import {MatDialog} from '@angular/material/dialog';
import {ShareDialogComponent} from './share-dialog.component';

@Component({
    selector: 'app-vm',
    templateUrl: './vm.component.html',
    styleUrls: ['./vm.component.css']
})
export class VmComponent implements OnInit {

    group: Group = TEST_GROUP;
    vms: Vm[] = [];

    // Form data new vm
    newVmCpu = new FormControl(1);
    newVmRam = new FormControl(256);
    newVmDisk = new FormControl(512);

    @ViewChild('vmsAccordion') accordion: MatAccordion;

    constructor(private vmService: VmService, private shareDialog: MatDialog) {
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

    saveNewVm() {
        // TODO:  UPDATE resources usage for the group. To do vm service

    }

    checkResourcesLimits(): boolean {
        if (this.vms.length === 0) {
            return true;
        }
        const reducer = (accumulator, currentValue) => accumulator + currentValue;
        let actualCpu = this.vms.map(vm => vm.cpu).reduce(reducer);
        let actualRam = this.vms.map(vm => vm.ram).reduce(reducer);
        let actualDisk = this.vms.map(vm => vm.disk).reduce(reducer);

        return (
            this.group.cpu >= actualCpu + this.newVmCpu.value &&
            this.group.ram >= actualRam + this.newVmRam.value &&
            this.group.disk >= actualDisk + this.newVmDisk.value &&
            this.group.max >= this.vms.length + 1
        );
    }

    resetNewValues() {
        this.newVmCpu.setValue(1);
        this.newVmRam.setValue(256);
        this.newVmDisk.setValue(512);
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
}
