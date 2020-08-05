import {Student, TEST_STUDENT1, TEST_STUDENT2, TEST_STUDENT3} from './student.model';
import { Resources } from './resources.model';

export class Group {
    id: string;
    name: string;

    //courseId: string;
    
    vmModel: string;

    resources: Resources
    members: Student[];

    constructor(id?: string, name?: string, vmModel?: string, resources?: Resources, members?: Student[]) {
        this.id = id;
        this.name = name;
        this.vmModel = vmModel;
        this.resources = resources
        this.members = members;
    }

    toString(): string {
        return this.name + ' (' + this.id + ')';
    }
}

export const TEST_GROUP: Group = new Group(
    '1',
    'gr1',
    'vm1',
    new Resources(1, 10, 10, 10, 10, 50, 10, 10, 10, 10, 10),
    [TEST_STUDENT1, TEST_STUDENT2, TEST_STUDENT3]
);
