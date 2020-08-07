export class Course {
    id: string
    name: string
    min: number
    max: number
    enabled: boolean
    teacherId: string // course owner

    constructor(id: string, name: string, min: number, max: number, enabled: boolean, teacherId: string) {
        this.id = id
        this.name = name
        this.min = min
        this.max = max
        this.enabled = enabled
        this.teacherId = teacherId
    }
}