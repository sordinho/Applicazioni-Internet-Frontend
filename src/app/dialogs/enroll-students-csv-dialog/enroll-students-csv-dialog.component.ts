import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Student } from 'src/app/models/student.model';
import { CourseService } from 'src/app/services/course.service';

@Component({
  selector: 'app-enroll-students-csv-dialog',
  templateUrl: './enroll-students-csv-dialog.component.html',
  styleUrls: ['./enroll-students-csv-dialog.component.css']
})
export class EnrollStudentsCsvDialogComponent implements OnInit {

  students: Student[]
  enrollableStudents: Student[] = [] /* enrollable list (from the CSV file) */
  totalStudents: number = 0 /* total number of students (in the CSV file) */

  courseId: string

  file: File
  defaultFilename = 'No file chosen'
  filename: string

  fileRequiredError = false
  fileError = false
  errorMessage: string = "1+ invalid student! Check the file and upload again." // default error message

  loading = false;

  constructor(private dialogRef: MatDialogRef<EnrollStudentsCsvDialogComponent>, @Inject(MAT_DIALOG_DATA) public data, private courseService: CourseService) { 
    this.students = data.students
    this.courseId = data.courseId
  }

  ngOnInit(): void {
    this.filename = this.defaultFilename
  }

  cancel() {
    this.dialogRef.close(false)
  }

  fileChange(files: any) {
    /* when the load event is fired and the file not empty */
    if(files && files.length > 0) {
      this.fileRequiredError = false
      this.enrollableStudents = [] // clear enrollableStudents list
      this.totalStudents = 0

      /* Fill file variable with the file content */
      this.file = files[0]
      this.filename = this.file.name

      if(this.file.type === 'text/csv') {
        this.fileError = false

        let reader: FileReader = new FileReader()
        reader.readAsText(this.file)
        reader.onload = _ => {
          let csv: string = reader.result as string
          const csvSeparator = ','

          const colId = csv.split('\n')
              .slice(0, 1)[0] /* get first (header) line */
              .split(csvSeparator) 
              .indexOf('id') /* find the 'id' column number */

          csv.split('\n')
              .slice(1, csv.length) /* skip first (header) line */
              .forEach((line: string) => {
                let id = line.split(csvSeparator)[colId] /* get the student id */
                if(id !== undefined) { /* id = can be undefined for example for the last line of the csv file */ 
                  let foundStudent = this.students.find(stud => stud.id == id) /* find the student id in the (all) students list */
                  if(foundStudent !== undefined) this.enrollableStudents.push(foundStudent) /* count enrollable students in the CSV file */
                  this.totalStudents++ /* count total students in the CSV file */
                }
              })
        }
      } else {
        this.filename = this.defaultFilename
        this.fileError = true
        this.errorMessage = "Invalid file format (CSV containing student ids)"
      }
    }
  }

  enroll() {
    this.loading = true    
    this.courseService.enrollAll(this.file, this.courseId)
      .subscribe(
        succ => {
          this.loading = false
          this.dialogRef.close(true)
        },
        err => {
          this.loading = false
          this.fileError = true
          if(err.status === 404) {
            this.errorMessage = "1+ students not found! Check the file and try again."
          } else {
            this.errorMessage = err.error
          }

        }
      )
  }

}
