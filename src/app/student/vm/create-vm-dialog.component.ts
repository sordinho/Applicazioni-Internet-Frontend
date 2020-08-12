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
    newVmRam = new FormControl(256);
    newVmDisk = new FormControl(512);

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
        if (this.vms.length === 0) {
            return true;
        }
        const reducer = (accumulator, currentValue) => accumulator + currentValue;
        let actualCpu = this.vms.map(vm => vm.num_vcpu).reduce(reducer);
        let actualRam = this.vms.map(vm => vm.ram).reduce(reducer);
        let actualDisk = this.vms.map(vm => vm.disk_space).reduce(reducer);

        return (
            this.team.resources.maxVcpu >= actualCpu + this.newVmCpu.value &&
            this.team.resources.maxRam >= actualRam + this.newVmRam.value &&
            this.team.resources.maxDiskSpace >= actualDisk + this.newVmDisk.value &&
            this.team.resources.maxTot >= this.vms.length + 1
        );
    }

    resetNewValues() {
        this.newVmCpu.setValue(1);
        this.newVmRam.setValue(256);
        this.newVmDisk.setValue(512);
    }

    saveNewVm() {
        // TODO:  UPDATE resources usage for the group. To do vm service

    }

}
