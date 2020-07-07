import {Component, OnInit, ViewChild} from '@angular/core';
import {Student} from '../../models/student.model';
import {Group, TEST_GROUP} from '../../models/group.model';
import {GroupService} from '../../services/group.service';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {TEST_VM_UBUNTU, TEST_VM_WIN, Vm} from '../../models/vm.model';
import {MatAccordion} from '@angular/material/expansion';
import {FormBuilder, FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {VmService} from '../../services/vm.service';

@Component({
    selector: 'app-vms',
    templateUrl: './vms.component.html',
    styleUrls: ['./vms.component.css']
})
export class VmsComponent implements OnInit {

    _filteredGroups: Group[] = [];
    _allGroups: Group[] = [];
    selectedGroup: Group = null;
    vms: Vm[] = [];

    // Form data from resources limits
    cpuLimit = new FormControl();
    ramLimit = new FormControl();
    diskLimit = new FormControl();
    activesLimit = new FormControl();
    maxLimit = new FormControl();

    @ViewChild('vmsAccordion') accordion: MatAccordion;

    constructor(private groupVMsService: GroupService, private vmService: VmService) {
    }

    ngOnInit(): void {
        this.getAllGroups();
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
        let actualCpu = this.vms.map(vm => vm.cpu).reduce(reducer);
        let actualRam = this.vms.map(vm => vm.ram).reduce(reducer);
        let actualDisk = this.vms.map(vm => vm.disk).reduce(reducer);
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
}
