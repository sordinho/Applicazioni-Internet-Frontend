import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-upload-correction-dialog',
  templateUrl: './upload-correction-dialog.component.html',
  styleUrls: ['./upload-correction-dialog.component.css']
})
export class UploadCorrectionDialogComponent implements OnInit {

  error = false;

  constructor(private dialogRef: MatDialogRef<UploadCorrectionDialogComponent>) { }

  ngOnInit(): void {
  }

  cancel() {
    this.dialogRef.close(false)
  }

  publish() {
    console.dir("UploadCorrectionDialogComponent - publish() - TODO")

    this.dialogRef.close(true)
  }

}
