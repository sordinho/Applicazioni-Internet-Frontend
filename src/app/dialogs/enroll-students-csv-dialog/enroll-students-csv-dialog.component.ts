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
  selectedStudents: Student[]
  enrollableStudents: Student[] = []

  totalStudents: number = 0 // number of students in the csv file

  courseId: string

  file: File
  defaultFilename = 'No file chosen'
  filename: string

  fileRequiredError = false
  fileError = false
  errorMessage: string

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
    //console.dir("fileChange - files: " + JSON.stringify(files))
    // when the load event is fired and the file not empty
    if(files && files.length > 0) {
      // Fill file variable with the file content
      this.fileRequiredError = false
      this.enrollableStudents = [] // clear enrollableStudents list
      this.totalStudents = 0

      this.file = files[0]
      this.filename = this.file.name

      if(this.file.type === 'text/csv') {
        this.fileError = false

        let reader: FileReader = new FileReader()
        reader.readAsText(this.file)
        reader.onload = (e) => {
          let csv: string = reader.result as string

          csv.split('\n')
              .slice(1, csv.length) // remove first (header) line
              .forEach((id:string) => {
                let foundStudent = this.students.find(stud => stud.id == id)
                if(foundStudent !== undefined) this.enrollableStudents.push(foundStudent)
                
                if(id !== '') {
                  this.totalStudents++
                }
              })
        }
      } else {
        this.filename = this.defaultFilename
        this.fileError = true
        this.errorMessage = "Invalid file format (CSV containing only the userIds, with the header)"
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
