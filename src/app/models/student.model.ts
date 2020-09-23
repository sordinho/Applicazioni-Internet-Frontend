export class Student {
    id: string;
    lastName: string;
    firstName: string;
    email: string;
    image: string[];
    status: string; // temporary save here status of the student inside a group
    team: string;

    constructor(id: string, lastName: string, firstName: string, email: string, image = [], team: string = '') {
        this.id = id;
        this.lastName = lastName;
        this.firstName = firstName;
        this.email = email;
        this.image = image;
        this.team = team
    }

    toString(): string {
        return this.lastName + ' ' +
            this.firstName + ' (' +
            this.id + ')';
    }
}
