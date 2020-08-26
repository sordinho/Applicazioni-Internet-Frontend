import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormControl, Validators} from '@angular/forms';
import {Vm} from '../../models/vm.model';
import {Team} from '../../models/team.model';
import {VmService} from '../../services/vm.service';
import {ConfigurationModel} from '../../models/configuration.model';

@Component({
    selector: 'app-create-vm-dialog',
    templateUrl: './create-vm-dialog.component.html',
    styleUrls: ['./create-vm-dialog.component.css']
})
export class CreateVmDialogComponent implements OnInit {

    // Form data new vm
    newVmCpu = new FormControl(1, Validators.required);
    newVmRam = new FormControl(1, Validators.required);
    newVmDisk = new FormControl(1, Validators.required);
    working: Boolean = false;

    team: Team;
    vms: Vm[] = [];
    configuration: ConfigurationModel;

    constructor(@Inject(MAT_DIALOG_DATA) public data, private dialogRef: MatDialogRef<CreateVmDialogComponent>,
                private vmService: VmService) {
    }

    ngOnInit(): void {
        this.team = this.data.group;
        this.vms = this.data.vms;
        this.configuration = this.data.configuration;
        this.initMinValues();
        if (this.data.action === 'UPDATE') {
            this.initFormFromVmValues(this.data.vmToUpdate);
        }
    }

    initFormFromVmValues(vm: Vm) {
        this.newVmCpu.setValue(vm.num_vcpu);
        this.newVmRam.setValue(vm.ram);
        this.newVmDisk.setValue(vm.disk_space);
    }

    initMinValues() {
        this.newVmCpu.setValue(this.configuration.min_vcpu);
        this.newVmRam.setValue(this.configuration.min_ram);
        this.newVmDisk.setValue(this.configuration.min_disk);
        this.newVmCpu.setValidators(Validators.min(this.configuration.min_vcpu));
        this.newVmRam.setValidators(Validators.min(this.configuration.min_ram));
        this.newVmDisk.setValidators(Validators.min(this.configuration.min_disk));
    }

    closeDialog(res: string = '') {
        this.dialogRef.close(res);
    }

    checkValidFormValues(): boolean {
        return !(this.newVmCpu.errors || this.newVmRam.errors || this.newVmDisk.errors);
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
            if (this.data.action === 'UPDATE') {
                actualCpu -= this.data.vmToUpdate.num_vcpu;
                actualRam -= this.data.vmToUpdate.ram;
                actualDisk -= this.data.vmToUpdate.disk_space;
            }
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
        console.log(this.newVmCpu.value);
        console.log(this.newVmRam.value);
        console.log(this.newVmDisk.value);
        console.log(this.data.creatorId);
        console.log(this.team.id);
        console.log(this.data.vmModel);
        this.working = true;
        this.vmService.createNewVm(this.newVmCpu.value, this.newVmRam.value, this.newVmDisk.value, this.data.creatorId,
            this.team.id, this.data.vmModel).subscribe((data) => {
            this.closeDialog('OK');
        });
    }

    updateVm() {
        console.log('UPDATE');
        console.log(this.data.vmToUpdate.id);
        console.log(this.newVmCpu.value);
        console.log(this.newVmRam.value);
        console.log(this.newVmDisk.value);
        console.log(this.data.creatorId);
        console.log(this.team.id);
        console.log(this.data.vmModel);
        this.working = true;
        this.vmService.updateVm(this.data.vmToUpdate.id, this.newVmCpu.value, this.newVmRam.value, this.newVmDisk.value, this.data.creatorId,
            this.team.id, this.data.vmModel).subscribe((data) => {
            this.closeDialog('OK');
        });
    }

}
