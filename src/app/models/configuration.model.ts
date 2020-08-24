export class ConfigurationModel {
    id: number;
    min_vcpu: number;
    max_vcpu: number;
    min_disk: number;
    max_disk: number;
    min_ram: number;
    max_ram: number;
    tot: number;
    max_on: number;
    teamId: number;


    constructor(id: number, min_vcpu: number, max_vcpu: number, min_disk: number, max_disk: number, min_ram: number, max_ram: number, tot: number, max_on: number, teamId: number) {
        this.id = id;
        this.min_vcpu = min_vcpu;
        this.max_vcpu = max_vcpu;
        this.min_disk = min_disk;
        this.max_disk = max_disk;
        this.min_ram = min_ram;
        this.max_ram = max_ram;
        this.tot = tot;
        this.max_on = max_on;
        this.teamId = teamId;
    }
}
