import {Component, OnInit, ViewChild} from '@angular/core';
import {GroupService} from '../../services/group.service';
import {Vm} from '../../models/vm.model';
import {MatAccordion} from '@angular/material/expansion';
import {VmService} from '../../services/vm.service';
import {FormControl} from '@angular/forms';
import {VmModel} from '../../models/vmModel.model';
import {MatOption} from '@angular/material/core';
import {Team} from '../../models/team.model';
import {VmModelService} from '../../services/vm-model.service';
import {CourseService} from '../../services/course.service';
import {Course} from '../../models/course.model';
import {ActivatedRoute} from '@angular/router';
import {forkJoin} from 'rxjs';

@Component({
    selector: 'app-vms',
    templateUrl: './vms.component.html',
    styleUrls: ['./vms.component.css']
})
export class VmsComponent implements OnInit {

    _filteredTeams: Team[] = [];
    _allTeams: Team[] = [];
    selectedTeam: Team = null;
    editModel = false;
    osModelSelected = false;
    vms: Vm[] = [];
    osTypes: VmModel[];
    vmModel: VmModel = null;
    course: Course = null;


    // Form data from resources limits
    cpuLimit = new FormControl();
    ramLimit = new FormControl();
    diskLimit = new FormControl();
    activesLimit = new FormControl();
    maxLimit = new FormControl();
    osTypeSelect = new FormControl();

    @ViewChild('vmsAccordion') accordion: MatAccordion;

    constructor(private groupVMsService: GroupService, private vmService: VmService,
                private vmModelService: VmModelService, private courseService: CourseService,
                private groupService: GroupService, private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.getAllGroups();
        this.vmModelService.getAllModels().subscribe((data) => {
            this.osTypes = data;
            console.log(data);
        });
        this.initCourseVmModel();
    }

    initCourseVmModel() {
        // init course object
        this.courseService.find(this.route.snapshot.parent.url[1].toString()).subscribe((data) => {
            this.course = data;
            if (this.course.vmModelLink !== null) {
                // vm model is selected for the current group
                this.vmModelService.getModelInfoByDirectLink(this.course.vmModelLink).subscribe((data) => {
                    this.vmModel = data;
                    this.osTypeSelect.setValue(this.vmModel.id);
                });
            }
        });
    }

    displayFn(team: Team) {
        if (team == null || typeof (team.id) == 'undefined') {
            return '';
        }
        return team.name + ' (' + team.id + ')';
    }

    filter(event) {
        let substringToFind = event.target.value.toLowerCase();
        this._filteredTeams = this._allTeams
            .filter((g) =>
                this.displayFn(g).toLocaleLowerCase().includes(substringToFind));
    }

    getAllGroups() {
        // this.groupVMsService.getAllGroups()
        this.courseService.getAllGroups(this.route.snapshot.parent.url[1].toString())
            .subscribe((data) => {
                this._allTeams = data;
                this._filteredTeams = data;
                console.log(data);
            });
    }

    updateAddSelection(value: Team) {
        this.selectedTeam = value;
        // Get Members
        // Get Resources
        let members$ = this.groupService.getMembers(this.selectedTeam.id);
        let resources$ = this.groupService.getResources(this.selectedTeam.id);
        let vms$ = null; //TODO this.getGroupVmsData();
        forkJoin([members$, resources$]).subscribe(data => {
            this.selectedTeam.members = data[0];
            this.selectedTeam.resources = data[1];

            this.updateFormValues();
        });


        console.log('selected: ' + this.selectedTeam.toString());
        // console.log('cpu: ' + this.selectedTeam.resources.maxVcpu);
        // console.log('ram: ' + this.selectedTeam.resources.maxRam);

    }

    updateFormValues() {
        this.cpuLimit.setValue(this.selectedTeam.resources.maxVcpu);
        this.ramLimit.setValue(this.selectedTeam.resources.maxRam);
        this.diskLimit.setValue(this.selectedTeam.resources.maxDiskSpace);
        this.activesLimit.setValue(this.selectedTeam.resources.maxOn);
        this.maxLimit.setValue(this.selectedTeam.resources.maxTot);
    }

    getGroupVmsData() {
        this.vmService.getVmsByGroupId(this.selectedTeam.id).subscribe((data) => {
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

        // No previous vmModel
        if (this.vmModel == null) {
            this.vmModelService.createVmModel(this.course.id, this.osTypeSelect.value).subscribe(data => {
                    console.log('CREATED VMMODEL');
                }
            );
        } else if (this.osTypeSelect.value !== this.vmModel.id) {
            this.vmModelService.deleteVmModel(this.vmModel.uniqueId).subscribe(data => {
                this.vmModelService.createVmModel(this.course.id, this.osTypeSelect.value).subscribe(data => {
                        console.log('UPDATED VMMODEL');
                    }
                );
            });
        }
    }

    enableEditModel() {
        this.editModel = true;
    }

}
