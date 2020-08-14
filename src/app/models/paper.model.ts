import { Student } from './student.model'

export class Paper {
    id: string
    student: Student
    published: string
    status: string
    flag: boolean
    score: number
    image: any

    constructor(id: string, student: Student, published: string, status: string, flag: boolean, score: number, image: any) {
        this.id = id
        this.student = student
        this.published = published
        this.status = status
        this.flag = flag
        this.score = score
        this.image = image
    }

    toString(): string {
        return this.id + ' (name: ' + this.student.lastName + ', fistName: ' + this.student.firstName + ')';
    }
}
