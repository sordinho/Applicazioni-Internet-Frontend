import {Component, OnInit} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {Assignment} from '../../models/assignment.model';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {Paper} from '../../models/paper.model';
import {Student} from '../../models/student.model';
import {CourseService} from '../../services/course.service';
import {ActivatedRoute} from '@angular/router';
import {StudentService} from '../../services/student.service';
import {AuthService} from '../../services/auth.service';
import {AssignmentService} from '../../services/assignment.service';


@Component({
    selector: 'app-deliveries',
    templateUrl: './deliveries.component.html',
    styleUrls: ['./deliveries.component.css'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({height: '0px', minHeight: '0'})),
            state('expanded', style({height: '*'})),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
})
export class DeliveriesComponent implements OnInit {

    columnsToDisplay = ['id'].concat('releaseDate', 'expireDate', 'download');
    dataSource: MatTableDataSource<Assignment>;
    expandedElement: Assignment | null;
    courseId = '';
    dataFetched = false;
    selectedFile: File;
    papers = new Map<string, Paper[]>();
    uploadEnabled = false;

    constructor(private courseService: CourseService, private studentService: StudentService, private assignmentService: AssignmentService,
                private authService: AuthService, private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.courseId = this.route.snapshot.parent.url[1].toString();
        this.initAssignments();
    }

    initAssignments() {
        // Get all assignments
        this.courseService.queryAllAssigments(this.courseId).subscribe((assignments) => {
            this.dataSource = new MatTableDataSource<Assignment>(assignments);

            let assignmentCounter = 0;
            assignments.forEach((assignment) => {
                console.log(assignment);
                this.studentService.getPapersByAssignment(this.authService.getUserId(), assignment.id).subscribe((paperList) => {
                    console.log(paperList);
                    this.papers.set(assignment.id, paperList);
                    assignmentCounter++;
                    this.dataFetched = assignmentCounter === assignments.length;
                });
            });
        });
    }

    getScore(assignmentId: string) {
        let paperList = this.papers.get(assignmentId);
        let score = null;
        paperList.forEach((paper) => {
            if (paper.score != null) {
                score = paper.score;
            }
        });
        return score;
    }

    downloadAssignment(event: any, assignment: Assignment) {
        event.stopPropagation();
        console.log('Download: ' + assignment);
        this.downloadImage(assignment.image);
        if (this.papers.get(assignment.id).length > 0) {
            this.assignmentService.setAssignmentAsReadByStudent(assignment.id, this.authService.getUserId());
        }
    }

    uploadTask(assignment: any) {
        console.log('Upload: ' + assignment);
        console.log(this.selectedFile);

    }

    downloadDelivered(paper: Paper) {
        console.log('Download: ' + paper.id + ' ' + paper.status);
        this.downloadImage(paper.image);
    }

    onFileChanged(event) {
        // Select File
        this.selectedFile = event.target.files[0];
    }

    downloadImage(image: any) {
        const a = document.createElement('a'); // Create <a>
        a.href = image; // Image Base64 Goes here
        a.download = 'Image.png'; // File name Here
        a.click(); // Downloaded file
        a.remove();
    }
}
