export class Course {
    id: string
    name: string
    min: number
    max: number
    enabled: boolean

    constructor(id: string, name: string, min: number, max: number) {
        this.id = id
        this.name = name
        this.min = min
        this.max = max
    }

}