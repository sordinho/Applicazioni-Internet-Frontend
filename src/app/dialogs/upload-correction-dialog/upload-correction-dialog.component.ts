import { Component, OnInit, EventEmitter, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Assignment } from 'src/app/models/assignment.model';
import { AssignmentService } from 'src/app/services/assignment.service';
import * as moment from 'moment';

@Component({
  selector: 'app-upload-correction-dialog',
  templateUrl: './upload-correction-dialog.component.html',
  styleUrls: ['./upload-correction-dialog.component.css']
})
export class UploadCorrectionDialogComponent implements OnInit {

  assignment: Assignment
  studentId: string
  expired: boolean = false

  file: File
  defaultFilename = 'No file chosen'
  filename: string
  
  scorePaper = false

  score = new FormControl(
    {
      value: '', 
      disabled: true
    },
    {
      validators: [
        Validators.required
      ]
    })

  fileError = false

  constructor(private dialogRef: MatDialogRef<UploadCorrectionDialogComponent>, @Inject(MAT_DIALOG_DATA) public data, private assignmentService: AssignmentService, private snackBar: MatSnackBar) { 
    this.studentId = data.studentId
    this.assignment = data.assignment
    this.expired = moment(this.assignment.expired, '', true).isBefore(moment())
    if(this.expired) {
      this.score.enable()
      this.scorePaper = true
    }
  }

  ngOnInit(): void {
    this.filename = this.defaultFilename
  }

  cancel() {
    this.dialogRef.close(false)
  }

  fileChange(event: any) {
    //console.dir("fileChange - event: " + JSON.stringify(event))
    // when the load event is fired and the file not empty
    if(event.target.files && event.target.files.length > 0) {
      // Fill file variable with the file content
      this.fileError = false;

      this.file = event.target.files[0]
      this.filename = this.file.name
    }
  }

  toggleChange($event: MatSlideToggleChange) {
    this.scorePaper = $event.checked
    if(this.scorePaper) {
      this.score.enable()
    } else {
      this.score.disable()
    }
  }

  publish() {

    if(this.file === undefined) {
      /* invalid file */
      this.fileError = true
    } else if (this.scorePaper && this.score.invalid) {
      /* invalid score */
      this.score.markAsTouched({onlySelf: true})
    } else {
      /* all fields are valid */
      this.assignmentService.reviewPaper(this.assignment.id, this.studentId, this.file, (this.scorePaper ? this.score.value : 'NULL'), !this.scorePaper) /* review with score => flag = false */ 
            .subscribe(
              succ => {
                this.dialogRef.close(true)
              },
              err => {
                this.snackBar.open("Error uploading the correction, please check all fields and retry.", null, {
                  duration: 5000,
                }); 
              }
            )
    }

  }

  getScoreErrorMessage() {
    if (this.score.hasError('required')) {
      return 'Score is required'
    }
  }

}
