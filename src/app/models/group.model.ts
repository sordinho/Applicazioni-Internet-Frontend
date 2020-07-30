import {Student, TEST_STUDENT1, TEST_STUDENT2, TEST_STUDENT3} from './student.model';

export class Group {
    groupId: string;
    name: string;
    courseId: string;
    vmModel: string;
    cpu: number;
    ram: number;
    disk: number;
    actives: number;
    max: number;
    members: Student[];


    constructor(groupId: string, name: string, courseId: string, vmModel: string, cpu: number,
                ram: number, disk: number, actives: number, max: number, members: Student[]) {
        this.groupId = groupId;
        this.name = name;
        this.courseId = courseId;
        this.vmModel = vmModel;
        this.cpu = cpu;
        this.ram = ram;
        this.disk = disk;
        this.actives = actives;
        this.max = max;
        this.members = members;
    }

    toString(): string {
        return this.name + ' (' + this.groupId + ')';
    }
}

export const TEST_GROUP: Group = new Group(
    '1',
    'gr1',
    '1',
    'vm1',
    10,
    1024,
    10240,
    5,
    8,
    [TEST_STUDENT1, TEST_STUDENT2, TEST_STUDENT3]
);
