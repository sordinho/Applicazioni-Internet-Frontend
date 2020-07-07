export class Student {
    id: string;
    serial: string;
    name: string;
    firstName: string;
    courseId: string;
    groupId: string;

    constructor(id: string, serial: string, name: string, firstName: string, courseId: string = '0', groupId: string = '0') {
        this.id = id;
        this.serial = serial;
        this.name = name;
        this.firstName = firstName;
        this.courseId = courseId;
        this.groupId = groupId;
    }

    toString(): string {
        return this.name + ' ' +
            this.firstName + ' (' +
            this.serial + ')';
    }
}

export const TEST_STUDENT1: Student = new Student(
    '267571',
    's267571',
    'Mario',
    'Rossi',
    '1',
    '0'
);

export const TEST_STUDENT2: Student = new Student(
    '267570',
    's267570',
    'Davide',
    'Sordi',
    '1',
    '0'
);

export const TEST_STUDENT3: Student = new Student(
    '267572',
    's267571',
    'Giovanni',
    'Bianchi',
    '1',
    '0'
);
