import { Component, OnInit } from '@angular/core';
import { Paper } from 'src/app/models/paper.model';
import { Assignment } from 'src/app/models/assignment.model';
import { CourseService } from 'src/app/services/course.service';
import { ActivatedRoute } from '@angular/router';
import { Student } from 'src/app/models/student.model';
import { forkJoin, Observable } from 'rxjs';
import { StudentService } from 'src/app/services/student.service';
import { AssignmentService } from 'src/app/services/assignment.service';

@Component({
  selector: 'app-assigments-cont',
  templateUrl: './assigments-cont.component.html',
  styleUrls: ['./assigments-cont.component.css']
})
export class AssigmentsContComponent implements OnInit {

  assignments: Assignment[] /* assignments of the course */
  
  papers: Paper[] /* papers of a specific assigment */

  enrolledStudentReq: Observable<Student[]>

  paperHistory: Paper[] /* papers history of a student for a specific assigment */

  courseId: string

  constructor(private courseService: CourseService, private assignmentService: AssignmentService, private studentService: StudentService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.courseId = this.route.snapshot.parent.url[1].toString()

    this. enrolledStudentReq = this.courseService.queryEnrolledStudent(this.courseId)

    this.getAssignments()
  }

  getAssignments() {
    this.courseService.queryAllAssigments(this.courseId).subscribe(
      assignments => {
        this.assignments = assignments
      }
    )
  }

  getPapers(assignmentId: string) {
    const papersReq = this.assignmentService.queryPapers(assignmentId)
    /* it returns obj { paper: Paper, studentId: string } */
    forkJoin([papersReq, this.enrolledStudentReq]).subscribe(
      data => {
        let papers: Paper[] = []
        let paperObjects = data[0] /* obj [{ paper: Paper, studentId: string }] */
        const students: Student[] = data[1]

        paperObjects.forEach(
          (paperObj) => {
            /* for each paper associate the right student from students */ 
            let paper: Paper = paperObj.paper
            paper.student = students.find((s) => s.id === paperObj.studentId)
            papers.push(paper)
          }
        )
        this.papers = papers
      },
      error => {
        // TODO snackbar with error...
        this.papers = []
      })
  }

  getPaperHistory(event) {
    this.paperHistory = null /* reset paperHistory */
    /* get history of a student's papers */
    this.assignmentService.queryPaperHistory(event.assignmentId, event.student).subscribe(
      paperHistory => {
        this.paperHistory = paperHistory
      }
    )
  }

}
