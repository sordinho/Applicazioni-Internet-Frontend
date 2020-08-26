import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatTableDataSource} from '@angular/material/table';
import {Student} from '../../models/student.model';
import {SelectionModel} from '@angular/cdk/collections';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {VmService} from '../../services/vm.service';
import {forkJoin} from 'rxjs';

@Component({
    selector: 'app-share-dialog',
    templateUrl: './share-dialog.component.html',
    styleUrls: ['./share-dialog.component.css']
})
export class ShareDialogComponent implements OnInit {

    selectionModel: SelectionModel<Student> = new SelectionModel<Student>(true, []);
    dataSource: MatTableDataSource<Student>;
    colsToDisplay = ['select'].concat('id', 'lastName', 'firstName');
    working: Boolean = false;

    constructor(@Inject(MAT_DIALOG_DATA) public data, private dialogRef: MatDialogRef<ShareDialogComponent>, private  vmService: VmService) {
    }

    ngOnInit(): void {
        let members = this.data.group.members;
        let owners = this.data.vm.owners.map((s) => {
            return s.id;
        });
        let remaining = members.filter((n: Student) => !owners.includes(n.id));
        this.dataSource = new MatTableDataSource<Student>(remaining);
    }

    toggleTableRow(event: MatCheckboxChange, row: Student) {
        return this.selectionModel.toggle(row);
    }

    toggleTableMaster(event: MatCheckboxChange) {
        this.isAllSelected() ? this.selectionModel.clear() : this.dataSource.data.forEach(row => this.selectionModel.select(row));
    }

    isAllSelected() {
        const nSelected = this.selectionModel.selected.length;
        const nRows = this.dataSource.data.length;
        return nSelected == nRows;
    }

    shareWithSelected() {
        this.working = true;
        console.log('Selected: ' + this.selectionModel.selected.length);
        let requests = [];
        this.selectionModel.selected.forEach((s) => {
            console.log(s.id);
            let req = this.vmService.shareVm(this.data.vm.id, s.id);
            requests.push(req);
        });
        forkJoin(requests).subscribe(results => {
            console.log('Req: ' + requests.length);
            this.closeDialog('OK');
        });

    }

    closeDialog(res: string = '') {
        this.dialogRef.close(res);
    }
}
