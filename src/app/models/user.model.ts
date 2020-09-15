export class User {
    id: string;
    lastName: string;
    firstName: string;
    email: string;
    image: any;

    constructor(id: string, lastName: string, firstName: string, email: string, image) {
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
