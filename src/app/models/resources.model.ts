export class Resources {
    teamId: string;
    activeNumVcpu: number;
    activeDiskSpace: number;
    activeRam: number;
    activeVMs: number;
    tot: number;
    maxVcpu: number;
    maxDiskSpace: number;
    maxRam: number;
    maxOn: number;
    maxTot: number;

    constructor(teamId: string, activeNumVcpu: number, activeDiskSpace: number, activeRam: number, activeVMs: number,
                tot: number, maxVcpu: number, maxDiskSpace: number, maxRam: number, maxOn: number, maxTot: number) {
        this.teamId = teamId;
        this.activeNumVcpu = activeNumVcpu;
        this.activeDiskSpace = activeDiskSpace;
        this.activeRam = activeRam;
        this.activeVMs = activeVMs;
        this.tot = tot;
        this.maxVcpu = maxVcpu;
        this.maxDiskSpace = maxDiskSpace;
        this.maxRam = maxRam;
        this.maxOn = maxOn;
        this.maxTot = maxTot;
    }

}
