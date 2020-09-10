import { Component, OnInit, EventEmitter } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-upload-correction-dialog',
  templateUrl: './upload-correction-dialog.component.html',
  styleUrls: ['./upload-correction-dialog.component.css']
})
export class UploadCorrectionDialogComponent implements OnInit {

  file: File

  ratePaper = false

  error = false

  constructor(private dialogRef: MatDialogRef<UploadCorrectionDialogComponent>) { }

  ngOnInit(): void {
  }

  cancel() {
    this.dialogRef.close(false)
  }

  fileChange(event: any) {
    //console.dir("fileChange - event: " + JSON.stringify(event))
    // when the load event is fired and the file not empty
    if(event.target.files && event.target.files.length > 0) {
      // Fill file variable with the file content
      this.file = event.target.files[0]
    }
  }

  publish() {
    console.dir("UploadCorrectionDialogComponent - publish() - TODO")

    this.dialogRef.close(true)
  }

}
