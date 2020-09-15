import {Component, OnInit, ViewChild} from '@angular/core';
import {GroupService} from '../../services/group.service';
import {Vm} from '../../models/vm.model';
import {MatAccordion} from '@angular/material/expansion';
import {VmService} from '../../services/vm.service';
import {FormControl} from '@angular/forms';
import {VmModel} from '../../models/vmModel.model';
import {Team} from '../../models/team.model';
import {VmModelService} from '../../services/vm-model.service';
import {CourseService} from '../../services/course.service';
import {Course} from '../../models/course.model';
import {ActivatedRoute} from '@angular/router';
import {forkJoin} from 'rxjs';
import {StudentService} from '../../services/student.service';
import {ConfigurationService} from '../../services/configuration.service';
import {ConfigurationModel} from '../../models/configuration.model';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
    selector: 'app-vms',
    templateUrl: './vms.component.html',
    styleUrls: ['./vms.component.css']
})
export class VmsComponent implements OnInit {

    filteredTeams: Team[] = [];
    allTeams: Team[] = [];
    selectedTeam: Team = null;
    selectedTeamConfiguration: ConfigurationModel = null;
    editModel = false;
    osModelSelected = false;
    vms: Vm[] = [];
    osTypes: VmModel[];
    vmModel: VmModel = null;
    course: Course = null;
    disableSaveButton = false;
    vmDataFetched;
    modelFetched;


    // Form data from resources limits
    cpuLimit = new FormControl();
    ramLimit = new FormControl();
    diskLimit = new FormControl();
    activesLimit = new FormControl();
    maxLimit = new FormControl();
    osTypeSelect = new FormControl();
    minCpuLimit = new FormControl();
    minRamLimit = new FormControl();
    minDiskLimit = new FormControl();

    @ViewChild('vmsAccordion') accordion: MatAccordion;

    constructor(private groupVMsService: GroupService, private vmService: VmService,
                private vmModelService: VmModelService, private courseService: CourseService,
                private groupService: GroupService, private studentService: StudentService,
                private configurationService: ConfigurationService, private route: ActivatedRoute, private snackBar: MatSnackBar) {
    }

    ngOnInit(): void {
        this.getAllGroups();
        this.vmModelService.getAllModels().subscribe((data) => {
            this.osTypes = data;
        }, error => {
            this.snackBar.open('Error getting OS model, please refresh the page.', null, {
                duration: 5000,
            });
        });
        this.initCourseVmModel();
    }

    initCourseVmModel() {
        this.modelFetched = false;
        // init course object
        this.courseService.find(this.route.snapshot.parent.url[1].toString()).subscribe((course) => {
            this.course = course;
            if (this.course.vmModelLink !== null) {
                // vm model is selected for the current group
                this.vmModelService.getModelInfoByDirectLink(this.course.vmModelLink).subscribe((model) => {
                    this.vmModel = model;
                    this.osTypeSelect.setValue(this.vmModel.id);
                    this.modelFetched = true;
                }, error => {
                    this.snackBar.open('Error getting OS model, please refresh the page.', null, {
                        duration: 5000,
                    });
                });
            } else {
                this.modelFetched = true;
            }
        }, error => {
            this.snackBar.open('Error getting course information, please refresh the page.', null, {
                duration: 5000,
            });
        });
    }

    displayFn(team: Team) {
        if (team == null || typeof (team.id) === 'undefined') {
            return '';
        }
        return team.name + ' (' + team.id + ')';
    }

    filter(event) {
        let substringToFind = event.target.value.toLowerCase();
        this.filteredTeams = this.allTeams
            .filter((g) =>
                this.displayFn(g).toLocaleLowerCase().includes(substringToFind));
    }

    getAllGroups() {
        // this.groupVMsService.getAllGroups()
        this.courseService.getAllGroups(this.route.snapshot.parent.url[1].toString())
            .subscribe((data) => {
                this.allTeams = data;
                this.filteredTeams = data;
                // console.log(data);
            });
    }

    updateAddSelection(value: Team) {
        this.selectedTeamConfiguration = null;
        this.selectedTeam = value;
        // Get Members
        let members$ = this.groupService.getMembers(this.selectedTeam.id);

        // If team has a configuration...
        if (this.selectedTeam.configurationLink) {
            console.log(this.selectedTeam.configurationLink);
            let resources$ = this.groupService.getResources(this.selectedTeam.id);
            let vms$ = this.groupService.getVms(this.selectedTeam.id);
            let config$ = this.configurationService.getConfigurationByLink(this.selectedTeam.configurationLink);
            forkJoin([members$, resources$, vms$, config$]).subscribe(data => {
                this.selectedTeam.members = data[0];
                this.selectedTeam.resources = data[1];
                this.vms = data[2];
                this.selectedTeamConfiguration = data[3];

                this.updateFormValues();

                // get owners and creator info about all the vms
                this.vmDataFetched = 0;
                this.vms.forEach((vm) => {
                    this.vmService.getVmOwners(vm.id)
                        .subscribe((data) => {
                            vm.owners = data;
                            this.vmDataFetched++;
                            console.log('owner: ' + vm.owners);
                        }, error => {
                            this.snackBar.open('Error getting VMs owners, please retry.', null, {
                                duration: 5000,
                            });
                        });
                });
            }, error => {
                this.snackBar.open('Error getting VMs data, please retry.', null, {
                    duration: 5000,
                });
            });
        } else { // If team hasn't a configuration
            members$.subscribe((data) => {
                this.selectedTeam.members = data;
                this.selectedTeamConfiguration = new ConfigurationModel(-1, 0, 0, 0, 0, 0,
                    0, 0, 0, this.selectedTeam.id);
                this.updateFormValues();
            }, error => {
                this.snackBar.open('Error getting VMs owners, please retry.', null, {
                    duration: 5000,
                });
            });
        }


    }

    updateFormValues() {
        this.cpuLimit.setValue(this.selectedTeamConfiguration.max_vcpu);
        this.minCpuLimit.setValue(this.selectedTeamConfiguration.min_vcpu);
        this.ramLimit.setValue(this.selectedTeamConfiguration.max_ram);
        this.minRamLimit.setValue(this.selectedTeamConfiguration.min_ram);
        this.diskLimit.setValue(this.selectedTeamConfiguration.max_disk);
        this.minDiskLimit.setValue(this.selectedTeamConfiguration.min_disk);
        this.activesLimit.setValue(this.selectedTeamConfiguration.max_on);
        this.maxLimit.setValue(this.selectedTeamConfiguration.tot);
    }


    saveResourcesLimits() {
        this.disableSaveButton = true;
        this.selectedTeamConfiguration.min_vcpu = this.minCpuLimit.value;
        this.selectedTeamConfiguration.max_vcpu = this.cpuLimit.value;
        this.selectedTeamConfiguration.min_ram = this.minRamLimit.value;
        this.selectedTeamConfiguration.max_ram = this.ramLimit.value;
        this.selectedTeamConfiguration.min_disk = this.minDiskLimit.value;
        this.selectedTeamConfiguration.max_disk = this.diskLimit.value;
        this.selectedTeamConfiguration.max_on = this.activesLimit.value;
        this.selectedTeamConfiguration.tot = this.maxLimit.value;

        // no configuration set
        if (this.selectedTeamConfiguration.id == -1) {
            // Create new configuration
            this.configurationService.createNewConfiguration(this.selectedTeamConfiguration).subscribe((data) => {
                console.log('CREATED CONFIG');
                this.selectedTeamConfiguration = data;
                this.disableSaveButton = false;
                this.snackBar.open('Configuration Saved', null, {
                    duration: 5000,
                });
            }, error => {
                this.disableSaveButton = false;
                this.snackBar.open('Error Creating Configuration, please check your values', null, {
                    duration: 5000,
                });
            });
        } else {
            // Update configuration
            console.log('UPDATING: ' + this.selectedTeamConfiguration.id);
            this.configurationService.updateConfiguration(this.selectedTeamConfiguration).subscribe((data) => {
                console.log('UPDATED CONFIG');
                this.selectedTeamConfiguration = data;
                this.disableSaveButton = false;
                this.snackBar.open('Configuration Updated', null, {
                    duration: 5000,
                });
            }, error => {
                this.disableSaveButton = false;
                this.snackBar.open('Error Updating Configuration, please check your values', null, {
                    duration: 5000,
                });
            });
        }
    }

    checkMinResourcesLimit(): boolean {
        // configuration not fetched
        if (this.selectedTeamConfiguration == null) {
            return false;
        }

        // No configuration set
        if (this.selectedTeamConfiguration.id == -1) {
            return (
                this.minCpuLimit.value > 0 &&
                this.minRamLimit.value > 0 &&
                this.minDiskLimit.value > 0
            );
        } else {
            // Already set config
            return (
                this.minCpuLimit.value >= this.selectedTeamConfiguration.min_vcpu &&
                this.minRamLimit.value >= this.selectedTeamConfiguration.min_ram &&
                this.minDiskLimit.value >= this.selectedTeamConfiguration.min_disk
            );
        }
    }

    checkMaxResourcesLimits(): boolean {
        let actualCpu = 0;
        let actualRam = 0;
        let actualDisk = 0;
        let actualMax = 0;
        let actualActives = 0;

        // configuration not fetched
        if (this.selectedTeamConfiguration == null) {
            return false;
        }

        if (this.selectedTeamConfiguration.id == -1) {
            return (
                this.cpuLimit.value > 0 &&
                this.ramLimit.value > actualRam &&
                this.diskLimit.value > actualDisk &&
                this.activesLimit.value > actualActives &&
                this.maxLimit.value > actualMax
            );
        }

        if (this.activesLimit.value > this.maxLimit.value) {
            return false;
        }

        if (this.vms.length != 0) {
            const reducer = (accumulator, currentValue) => accumulator + currentValue;
            actualCpu = this.vms.map(vm => vm.num_vcpu).reduce(reducer);
            actualRam = this.vms.map(vm => vm.ram).reduce(reducer);
            actualDisk = this.vms.map(vm => vm.disk_space).reduce(reducer);
            actualMax = this.vms.length;
            actualActives = this.vms.filter(vm => {
                return vm.status === 'RUNNING';
            }).length;
        }
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
        let win = window.open('', 'VM ' + vm.id, 'width=1280, height=720, status=no, toolbar=no, menubar=no, location=no, addressbar=no');
        win.document.title = 'VM ' + vm.id;
        win.document.write('<head><title>VM ' + vm.id + '</title></head><body><img src="http://localhost:4200/assets/images/' + this.vmModel.id + '.png" style="max-width: 100%; height: auto;"></body>');
        win.document.close();
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
        // console.log(this.osTypeSelect);

        // No previous vmModel
        if (this.vmModel == null) {
            this.vmModelService.createVmModel(this.course.id, this.osTypeSelect.value).subscribe(data => {
                    // console.log('CREATED VMMODEL');
                    this.vmModel = data;
                    this.snackBar.open('Model Saved', null, {duration: 5000});
                }, error => {
                    this.snackBar.open('Error creating Model, please retry', null, {duration: 5000});
                }
            );
        } else if (this.osTypeSelect.value !== this.vmModel.id) {
            this.vmModelService.deleteVmModel(this.vmModel.uniqueId).subscribe(data => {
                this.vmModelService.createVmModel(this.course.id, this.osTypeSelect.value).subscribe(newModel => {
                        // console.log('UPDATED VMMODEL');
                        this.vmModel = newModel;
                        this.snackBar.open('Model Updated', null, {duration: 5000});
                    }, error => {
                        this.snackBar.open('Error updating Model, please retry', null, {duration: 5000});
                    }
                );
            }, error => {
                this.snackBar.open('Error check all vms are shut down', null, {duration: 5000});
                this.initCourseVmModel();
            });
        }
    }

    enableEditModel() {
        this.editModel = true;
    }

}
