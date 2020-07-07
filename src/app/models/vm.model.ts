import {Student, TEST_STUDENT1, TEST_STUDENT2, TEST_STUDENT3} from './student.model';
import {Group, TEST_GROUP} from './group.model';

export class Vm {
    id: string;
    name: string;
    vmModel: string;
    cpu: number;
    ram: number;
    disk: number;
    owner: Student[];
    group: Group;
    status: string;
    img: string;

    constructor(id: string, name: string, vmModel: string, cpu: number, ram: number,
                disk: number, owner: Student[], group: Group, status: string) {
        this.id = id;
        this.name = name;
        this.vmModel = vmModel;
        this.cpu = cpu;
        this.ram = ram;
        this.disk = disk;
        this.owner = owner;
        this.group = group;
        this.status = status;
    }
}

export const TEST_VM_UBUNTU: Vm = new Vm(
    '1234',
    'myUbuntu',
    'ubuntu',
    2,
    256,
    2048,
    [TEST_STUDENT1, TEST_STUDENT2],
    TEST_GROUP,
    'OFF',
);

TEST_VM_UBUNTU.img = 'https://assets.ubuntu.com/v1/8dd99b80-ubuntu-logo14.png';

export const TEST_VM_WIN: Vm = new Vm(
    '9876',
    'myWindows',
    'windows-10',
    2,
    512,
    2048,
    [TEST_STUDENT3],
    TEST_GROUP,
    'RUNNING',
);

TEST_VM_WIN.img = 'https://upload.wikimedia.org/wikipedia/commons/0/05/Windows_10_Logo.svg';
