import { Student } from './student.model'

export class Paper {
    id: string
    student: Student
    status: string
    statusDate: string

    constructor(id: string, student: Student, status: string, statusDate: string) {
        this.id = id
        this.student = student
        this.status = status
        this.statusDate = statusDate
    }

    toString(): string {
        return this.id + ' (name: ' + this.student.name + ', fistName: ' + this.student.firstName + ')';
    }
}
