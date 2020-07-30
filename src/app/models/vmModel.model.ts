export class VmModel {
    id: number;
    os: string;


    constructor(id: number, os: string) {
        this.id = id;
        this.os = os;
    }
}

export const osTypes = [
    {
        'value': 'WINDOWS_10',
        'name': 'Windows 10'
    },
    {
        'value': 'WINDOWS_7',
        'name': 'Windows 7'
    },
    {
        'value': 'UBUNTU',
        'name': 'Ubuntu'
    },
    {
        'value': 'MAC_OS',
        'name': 'Mac OS'
    }];
export const vmModelWin10: VmModel = new VmModel(1, 'WINDOWS_10');
export const vmModelWin7: VmModel = new VmModel(2, 'WINDOWS_7');
export const vmModelLinux: VmModel = new VmModel(3, 'UBUNTU');
export const vmModelMac: VmModel = new VmModel(4, 'MAC_OS');
