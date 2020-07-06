import {Component, OnInit, ViewChild} from '@angular/core';
import {Group, TEST_GROUP} from '../../models/group.model';
import {TEST_VM_UBUNTU, TEST_VM_WIN, Vm} from '../../models/vm.model';
import {MatAccordion} from '@angular/material/expansion';
import {FormControl} from '@angular/forms';

@Component({
    selector: 'app-vm',
    templateUrl: './vm.component.html',
    styleUrls: ['./vm.component.css']
})
export class VmComponent implements OnInit {

    group: Group = TEST_GROUP;
    vms: Vm[] = [TEST_VM_UBUNTU, TEST_VM_WIN];

    // Form data new vm
    newVmCpu = new FormControl(1);
    newVmRam = new FormControl(256);
    newVmDisk = new FormControl(512);

    @ViewChild('vmsAccordion') accordion: MatAccordion;

    constructor() {
    }

    ngOnInit(): void {
    }

    openAll() {
        this.accordion.openAll();
    }

    closeAll() {
        this.accordion.closeAll();
    }

    connectToVm(vm: Vm) {
        console.log('Connect to vm: ' + vm.id);

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
}
