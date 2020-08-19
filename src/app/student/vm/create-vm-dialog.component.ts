import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormControl} from '@angular/forms';
import {Vm} from '../../models/vm.model';
import {Team} from '../../models/team.model';

@Component({
    selector: 'app-create-vm-dialog',
    templateUrl: './create-vm-dialog.component.html',
    styleUrls: ['./create-vm-dialog.component.css']
})
export class CreateVmDialogComponent implements OnInit {

    // Form data new vm
    newVmCpu = new FormControl(1);
    newVmRam = new FormControl(1);
    newVmDisk = new FormControl(256);

    team: Team;
    vms: Vm[] = [];

    constructor(@Inject(MAT_DIALOG_DATA) public data, private dialogRef: MatDialogRef<CreateVmDialogComponent>) {
    }

    ngOnInit(): void {
        this.team = this.data.group;
        this.vms = this.data.vms;
    }

    closeDialog() {
        this.dialogRef.close();
    }

    checkResourcesLimits(): boolean {
        let actualCpu = 0;
        let actualRam = 0;
        let actualDisk = 0;
        if (this.vms.length !== 0) {
            const reducer = (accumulator, currentValue) => accumulator + currentValue;
            actualCpu = this.vms.map(vm => vm.num_vcpu).reduce(reducer);
            actualRam = this.vms.map(vm => vm.ram).reduce(reducer);
            actualDisk = this.vms.map(vm => vm.disk_space).reduce(reducer);
        }
        return (
            this.team.resources.maxVcpu >= actualCpu + this.newVmCpu.value &&
            this.team.resources.maxRam >= actualRam + this.newVmRam.value &&
            this.team.resources.maxDiskSpace >= actualDisk + this.newVmDisk.value &&
            this.team.resources.maxTot >= this.vms.length + 1
        );
    }

    resetNewValues() {
        this.newVmCpu.setValue(1);
        this.newVmRam.setValue(1);
        this.newVmDisk.setValue(256);
    }

    saveNewVm() {
        // TODO:  UPDATE resources usage for the group. To do vm service

    }

}
