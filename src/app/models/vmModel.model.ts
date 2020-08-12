export class VmModel {
    id: string;
    os: string;


    constructor(id: string) {
        this.id = id;
        this.generateValueFromId(id);
        console.log(this.os);
    }

    generateValueFromId(id: string) {
        let values = id.split('_');
        this.os = values[0][0] + values[0].slice(1).toLowerCase() + ' ' +
            values[1][0] + values[1].slice(1).toLowerCase();
    }
}

// export const osTypes = [
//     {
//         'value': 'WINDOWS_10',
//         'name': 'Windows 10'
//     },
//     {
//         'value': 'WINDOWS_7',
//         'name': 'Windows 7'
//     },
//     {
//         'value': 'UBUNTU',
//         'name': 'Ubuntu'
//     },
//     {
//         'value': 'MAC_OS',
//         'name': 'Mac OS'
//     }];
// export const vmModelWin10: VmModel = new VmModel('WINDOWS_10');
// export const vmModelWin7: VmModel = new VmModel('WINDOWS_7');
// export const vmModelLinux: VmModel = new VmModel('UBUNTU');
// export const vmModelMac: VmModel = new VmModel('MAC_OS');
