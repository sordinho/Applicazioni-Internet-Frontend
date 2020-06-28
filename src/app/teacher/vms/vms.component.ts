import {Component, OnInit, ViewChild} from '@angular/core';
import {Student} from '../../models/student.model';
import {Group, TEST_GROUP} from '../../models/group.model';
import {GroupService} from '../../services/group.service';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {TEST_VM_UBUNTU, TEST_VM_WIN, Vm} from '../../models/vm.model';
import {MatAccordion} from '@angular/material/expansion';
import {FormBuilder, FormControl, FormGroup, NgForm, Validators} from '@angular/forms';

@Component({
    selector: 'app-vms',
    templateUrl: './vms.component.html',
    styleUrls: ['./vms.component.css']
})
export class VmsComponent implements OnInit {

    _filteredGroups: Group[] = [];
    _allGroups: Group[] = [];
    selectedGroup: Group = TEST_GROUP;
    vms: Vm[] = [TEST_VM_UBUNTU, TEST_VM_WIN];

    // Form data from resources limits
    cpuLimit = new FormControl(this.selectedGroup.cpu);
    ramLimit = new FormControl(this.selectedGroup.ram);
    diskLimit = new FormControl(this.selectedGroup.disk);
    activesLimit = new FormControl(this.selectedGroup.actives);
    maxLimit = new FormControl(this.selectedGroup.max);

    @ViewChild('vmsAccordion') accordion: MatAccordion;

    constructor(private groupVMsService: GroupService) {
    }

    ngOnInit(): void {
        this.getAllGroups();
    }

    displayFn(group: Group) {
        return group.toString();
    }

    filter(filterValue: string = '') {
        filterValue = filterValue.trim(); // remove whitespace
        filterValue = filterValue.toLowerCase();
        //console.dir("'" + filterValue + "'");
        this._filteredGroups = this._allGroups
            .filter(g => {
                return filterValue === '' ? true : g.toString().toLowerCase().includes(filterValue);
            });
    }

    getAllGroups() {
        this.groupVMsService.getAllGroups()
            .subscribe((data) => {
                this._allGroups = data;
            });
    }

    updateAddSelection(event: MatAutocompleteSelectedEvent) {
        this.selectedGroup = (event && event.option) ? event.option.value : null;
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

    }

    openAll() {
        this.accordion.openAll();
    }

    closeAll() {
        this.accordion.closeAll();
    }
}
