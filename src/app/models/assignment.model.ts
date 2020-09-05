export class Assignment {
    id: string;
    published: string;
    expired: string;
    image: File;

    constructor(id: string, published: string, expired: string, image: File) {
        this.id = id;
        this.published = published;
        this.expired = expired;
        this.image = image;
    }

    toString(): string {
        return this.id + ' (publish date: ' + this.published + ', expire date: ' + this.expired + ')';
    }
}
