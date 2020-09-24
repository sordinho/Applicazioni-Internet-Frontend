import {Student} from './student.model';

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
