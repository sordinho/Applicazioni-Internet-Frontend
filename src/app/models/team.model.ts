import {Student, TEST_STUDENT1, TEST_STUDENT2, TEST_STUDENT3} from './student.model';
import {Resources} from './resources.model';

export class Team {
    id: string;
    name: string;
    status: string;
    resources: Resources;
    members: Student[];
    proposer: Student;

    constructor(id?: string, name?: string, status?: string) {
        this.id = id;
        this.name = name;
        this.status = status;
        this.resources = new Resources(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
        this.members = [];
    }

    toString(): string {
        return this.name + ' (' + this.id + ')';
    }
}

export const TEST_GROUP: Team = new Team(
    '1',
    'gr1',
    // 'vm1',
    'CONFIRMED',
    // new Resources(1, 10, 10, 10, 10, 50, 10, 10, 10, 10, 10),
    // [TEST_STUDENT1, TEST_STUDENT2, TEST_STUDENT3]
);
