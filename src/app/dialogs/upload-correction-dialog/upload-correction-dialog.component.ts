import { Component, OnInit, EventEmitter, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { AssignmentService } from 'src/app/services/assignment.service';

@Component({
  selector: 'app-upload-correction-dialog',
  templateUrl: './upload-correction-dialog.component.html',
  styleUrls: ['./upload-correction-dialog.component.css']
})
export class UploadCorrectionDialogComponent implements OnInit {

  assignmentId: string
  studentId: string

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

  constructor(private dialogRef: MatDialogRef<UploadCorrectionDialogComponent>, @Inject(MAT_DIALOG_DATA) public data, private assignmentService: AssignmentService) { 
    this.assignmentId = data.assignmentId
    this.studentId = data.studentId
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
      this.assignmentService.reviewPaper(this.assignmentId, this.studentId, this.file, (this.scorePaper ? this.score.value : 'NULL'), !this.scorePaper) /* review with score => flag = false */ 
            .subscribe(
              succ => {
                this.dialogRef.close(true)
              },
              err => {
                // TODO   
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
