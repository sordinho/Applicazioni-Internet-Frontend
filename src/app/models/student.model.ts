export class Student {
    id: string;
    lastName: string;
    firstName: string;
    email: string;
    image: string[];
    status: string; // temporary save here status of the student inside a group
    group: string;

    constructor(id: string, lastName: string, firstName: string, email: string, image = [], group?: string) {
        this.id = id;
        this.lastName = lastName;
        this.firstName = firstName;
        this.email = email;
        this.image = image;
        this.group = group ? group : ""
    }

    toString(): string {
        return this.lastName + ' ' +
            this.firstName + ' (' +
            this.id + ')';
    }
}
