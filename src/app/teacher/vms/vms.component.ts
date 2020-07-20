import {Component, OnInit, ViewChild} from '@angular/core';
import {Group,} from '../../models/group.model';
import {GroupService} from '../../services/group.service';
import {Vm} from '../../models/vm.model';
import {MatAccordion} from '@angular/material/expansion';
import {VmService} from '../../services/vm.service';
import {FormControl} from '@angular/forms';
import {osTypes, VmModel, vmModelLinux, vmModelMac, vmModelWin10, vmModelWin7} from '../../models/vmModel.model';
import {MatOption} from '@angular/material/core';

@Component({
    selector: 'app-vms',
    templateUrl: './vms.component.html',
    styleUrls: ['./vms.component.css']
})
export class VmsComponent implements OnInit {

    _filteredGroups: Group[] = [];
    _allGroups: Group[] = [];
    selectedGroup: Group = null;
    editModel = false;
    osModelSelected = false;
    vms: Vm[] = [];
    osTypes = osTypes;
    vmModel: VmModel = vmModelWin10;


    // Form data from resources limits
    cpuLimit = new FormControl();
    ramLimit = new FormControl();
    diskLimit = new FormControl();
    activesLimit = new FormControl();
    maxLimit = new FormControl();
    osTypeSelect = new FormControl();

    @ViewChild('vmsAccordion') accordion: MatAccordion;

    constructor(private groupVMsService: GroupService, private vmService: VmService) {
    }

    ngOnInit(): void {
        this.getAllGroups();
        this.osTypeSelect.setValue(this.vmModel.os);
    }

    displayFn(group: Group) {
        if (group == null || typeof (group.groupId) == 'undefined') {
            return '';
        }
        return group.name + ' (' + group.groupId + ')';
    }

    filter(event) {
        let substringToFind = event.target.value.toLowerCase();
        this._filteredGroups = this._allGroups
            .filter((g) =>
                this.displayFn(g).toLocaleLowerCase().includes(substringToFind));
    }

    getAllGroups() {
        this.groupVMsService.getAllGroups()
            .subscribe((data) => {
                this._allGroups = data;
                this._filteredGroups = data;
                console.log(data);
            });
    }

    updateAddSelection(value: Group) {
        this.selectedGroup = value;
        console.log('selected: ' + this.selectedGroup.toString());
        console.log('cpu: ' + this.selectedGroup.cpu);
        console.log('ram: ' + this.selectedGroup.ram);
        this.updateFormValues();
        this.getGroupVmsData();

    }

    updateFormValues() {
        this.cpuLimit.setValue(this.selectedGroup.cpu);
        this.ramLimit.setValue(this.selectedGroup.ram);
        this.diskLimit.setValue(this.selectedGroup.disk);
        this.activesLimit.setValue(this.selectedGroup.actives);
        this.maxLimit.setValue(this.selectedGroup.max);
    }

    getGroupVmsData() {
        this.vmService.getVmsByGroupId(this.selectedGroup.groupId).subscribe((data) => {
            this.vms = data;
        });
    }


    saveResourcesLimits() {
        // TODO:  UPDATE resources limits for the group. To do vm service

    }

    checkResourcesLimits(): boolean {
        const reducer = (accumulator, currentValue) => accumulator + currentValue;
        let actualCpu = this.vms.map(vm => vm.num_vcpu).reduce(reducer);
        let actualRam = this.vms.map(vm => vm.ram).reduce(reducer);
        let actualDisk = this.vms.map(vm => vm.disk_space).reduce(reducer);
        let actualMax = this.vms.length;
        let actualActives = this.vms.filter(vm => {
            return vm.status === 'RUNNING';
        }).length;

        return (
            this.cpuLimit.value >= actualCpu &&
            this.ramLimit.value >= actualRam &&
            this.diskLimit.value >= actualDisk &&
            this.activesLimit.value >= actualActives &&
            this.maxLimit.value >= actualMax
        );
    }

    connectToVm(vm: Vm) {
        console.log('Connect to vm: ' + vm.id);
        window.open('https://www.google.com');
    }

    openAll() {
        this.accordion.openAll();
    }

    closeAll() {
        this.accordion.closeAll();
    }

    saveModel() {
        this.editModel = false;
        this.osModelSelected = false;
        console.log(this.osTypeSelect);
        console.log(osTypes[0]['name']);
        switch (this.osTypeSelect.value) {
            case osTypes[0]['value']:
                this.vmModel = vmModelWin10;
                break;
            case osTypes[1]['value']:
                this.vmModel = vmModelWin7;
                break;
            case osTypes[2]['value']:
                this.vmModel = vmModelLinux;
                break;
            case osTypes[3]['value']:
                this.vmModel = vmModelMac;
                break;
        }
        // TODO delete all vms of the course!!!
    }

    getOsNameFromValue(value: string) {
        let name = '';
        switch (value) {
            case osTypes[0]['value']:
                name = osTypes[0]['name'];
                break;
            case osTypes[1]['value']:
                name = osTypes[1]['name'];
                break;
            case osTypes[2]['value']:
                name = osTypes[2]['name'];
                break;
            case osTypes[3]['value']:
                name = osTypes[3]['name'];
                break;
        }
        return name;
    }


}
