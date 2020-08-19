import {Student, TEST_STUDENT1, TEST_STUDENT2, TEST_STUDENT3} from './student.model';

export class Vm {
    id: string;
    num_vcpu: number;
    ram: number;
    disk_space: number;
    creatorId: string;
    creator: Student;
    owners: Student[];
    status: string;

    constructor(id: string, cpu: number, ram: number, disk: number, creatorID: string) {
        this.id = id;
        this.num_vcpu = cpu;
        this.ram = ram;
        this.disk_space = disk;
        this.creatorId = creatorID;
    }
}

// export class VmConfigurationModel {
//     min_vcpu: number;
//     max_vcpu: number;
//     min_disk: number;
//     max_disk: number;
//     min_ram: number;
//     max_ram: number;
//     tot: number;
//     max_on: number;
//
//
//     constructor(minCpu: number, maxCpu: number, minDisk: number, maxDisk: number, minRam: number, maxRam: number, maxTot: number, maxActives: number) {
//         this.min_vcpu = minCpu;
//         this.max_vcpu = maxCpu;
//         this.min_disk = minDisk;
//         this.max_disk = maxDisk;
//         this.min_ram = minRam;
//         this.max_ram = maxRam;
//         this.tot = maxTot;
//         this.max_on = maxActives;
//     }
// }

// export const TEST_VM_UBUNTU: Vm = new Vm(
//     '1234',
//     'ubuntu',
//     2,
//     256,
//     2048,
//     'OFF',
// );
// TEST_VM_UBUNTU.owners = [TEST_STUDENT1, TEST_STUDENT2];
//
//
// export const TEST_VM_WIN: Vm = new Vm(
//     '9876',
//     'windows-10',
//     2,
//     512,
//     2048,
//     'RUNNING',
// );
// TEST_VM_WIN.owners = [TEST_STUDENT3];

