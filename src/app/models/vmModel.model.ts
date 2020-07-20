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
export const vmModelWin: VmModel = new VmModel(1, 'WINDOWS 10');
export const vmModelLinux: VmModel = new VmModel(2, 'UBUNTU 20.04');
