export class VmModel {
    id: string;
    os: string;
    uniqueId: string;


    constructor(id: string) {
        this.id = id;
        this.os = this.generateValueFromId(id);
        // console.log(this.os);
    }

    generateValueFromId(id: string): string {
        if (id.includes('_')) {
            let values = id.split('_');
            return values[0][0] + values[0].slice(1).toLowerCase() + ' ' +
                values[1][0] + values[1].slice(1).toLowerCase();
        } else {
            return id[0] + id.slice(1).toLowerCase();
        }
    }
}
