export class Assignment {
    id: string
    releaseDate: string
    expireDate: string

    constructor(id: string, releaseDate: string, expireDate: string) {
        this.id = id
        this.releaseDate = releaseDate
        this.expireDate = expireDate
    }

    toString(): string {
        return this.id + ' (releaseDate: ' + this.releaseDate + ', expireDate: ' + this.expireDate + ')';
    }
}
