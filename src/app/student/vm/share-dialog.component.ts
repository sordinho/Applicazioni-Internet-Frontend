import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatTableDataSource} from '@angular/material/table';
import {Student} from '../../models/student.model';
import {SelectionModel} from '@angular/cdk/collections';
import {MatCheckboxChange} from '@angular/material/checkbox';

@Component({
    selector: 'app-share-dialog',
    templateUrl: './share-dialog.component.html',
    styleUrls: ['./share-dialog.component.css']
})
export class ShareDialogComponent implements OnInit {

    selectionModel: SelectionModel<Student> = new SelectionModel<Student>(true, []);
    dataSource: MatTableDataSource<Student>;
    colsToDisplay = ['select'].concat('serial', 'name', 'firstName');

    constructor(@Inject(MAT_DIALOG_DATA) public data, private dialogRef: MatDialogRef<ShareDialogComponent>) {
    }

    ngOnInit(): void {
        this.dataSource = new MatTableDataSource<Student>(this.data.group.members);
    }

    toggleTableRow(event: MatCheckboxChange, row: Student) {
        const ret = this.selectionModel.toggle(row);
        return ret;
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
        console.log('Selected: ' + this.selectionModel.selected.length);
        this.selectionModel.selected.forEach((s) => console.log(s.id));
        // this.dialogRef.close();
        // TODO share VM access with selected students
    }

    closeDialog() {
        this.dialogRef.close();
    }
}
