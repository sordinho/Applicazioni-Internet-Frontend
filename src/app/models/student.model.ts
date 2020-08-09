export class Student {
    id: string;
    lastName: string;
    firstName: string;
    email: string;
    image: string[];
    status: string; // temporary save here status of the student inside a group

    constructor(id: string, lastName: string, firstName: string, email: string, image = []) {
        this.id = id;
        this.lastName = lastName;
        this.firstName = firstName;
        this.email = email;
        this.image = image;
    }

    toString(): string {
        return this.lastName + ' ' +
            this.firstName + ' (' +
            this.id + ')';
    }
}

export const TEST_STUDENT1: Student = new Student(
    's267571',
    'Rossi',
    'Mario',
    'rm@email.it'
);

export const TEST_STUDENT2: Student = new Student(
    's267570',
    'Sordi',
    'Davide',
    'sd@email.it'
);

export const TEST_STUDENT3: Student = new Student(
    's267572',
    'Bianchi',
    'Giovanni',
    'bg@email.it'
);
