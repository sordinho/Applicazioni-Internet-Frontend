import { Student } from './student.model'

export class Paper {
    id: string
    student: Student
    status: string
    statusDate: string
    history: string

    constructor(id: string, student: Student, status: string, statusDate: string, history = "TODO - history list") {
        this.id = id
        this.student = student
        this.status = status
        this.statusDate = statusDate
        this.history = history
    }

    toString(): string {
        return this.id + ' (name: ' + this.student.name + ', fistName: ' + this.student.firstName + ')';
    }
}
