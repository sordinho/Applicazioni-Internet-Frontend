import {Student} from './student.model';
import {Resources} from './resources.model';

export class Team {
    id: string;
    name: string;
    status: string;
    resources: Resources;
    members: Student[];
    proposer: Student;
    configurationLink: string;

    constructor(id?: string, name?: string, status?: string) {
        this.id = id;
        this.name = name;
        this.status = status;
        // this.resources = new Resources(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
        this.members = [];
    }

    toString(): string {
        return this.name + ' (' + this.id + ')';
    }
}
