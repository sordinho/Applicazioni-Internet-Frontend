import {Component, OnInit} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {Assignment} from '../../models/assignment.model';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {Paper} from '../../models/paper.model';
import {CourseService} from '../../services/course.service';
import {ActivatedRoute} from '@angular/router';
import {StudentService} from '../../services/student.service';
import {AuthService} from '../../services/auth.service';
import {AssignmentService} from '../../services/assignment.service';
import {MatSnackBar} from '@angular/material/snack-bar';


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

    columnsToDisplay = ['id'].concat('releaseDate', 'expireDate', 'score', 'download');
    dataSource: MatTableDataSource<Assignment>;
    expandedElement: Assignment | null;
    courseId = '';
    dataFetched = false;
    selectedFile: File;
    papers = new Map<string, Paper[]>();
    uploadEnabled = new Map<string, boolean>();
    uploadButtonDisabled = true;

    constructor(private courseService: CourseService, private studentService: StudentService, private assignmentService: AssignmentService,
                private authService: AuthService, private route: ActivatedRoute, private snackbar: MatSnackBar) {
    }

    ngOnInit(): void {
        this.courseId = this.route.snapshot.parent.url[1].toString();
        this.initAssignments();
    }

    initAssignments() {
        // Get all assignments
        this.dataFetched = false;
        this.courseService.queryAllAssigments(this.courseId).subscribe((assignments) => {
            this.dataSource = new MatTableDataSource<Assignment>(assignments);

            let assignmentCounter = 0;
            if (assignments.length === 0) {
                this.dataFetched = true;
            } else {
                assignments.forEach((assignment) => {
                    console.log(assignment);
                    this.uploadEnabled.set(assignment.id, true);
                    this.studentService.getPapersByAssignment(this.authService.getUserId(), assignment.id).subscribe((paperList) => {
                        console.log(paperList);
                        this.papers.set(assignment.id, paperList);
                        paperList.forEach((p) => {
                            if (!p.flag) {
                                this.uploadEnabled.set(assignment.id, false);
                            }
                        });
                        assignmentCounter++;
                        this.dataFetched = assignmentCounter === assignments.length;
                    }, error => {
                        // this.dataFetched = true;
                        this.papers.set(assignment.id, []);
                        assignmentCounter++;
                        this.dataFetched = assignmentCounter === assignments.length;
                        // this.snackbar.open('Error fetching assignments', null, {duration: 5000});
                        // return;
                    });
                });d
            }
        }, error => {
            this.dataFetched = true;
            this.snackbar.open('Error fetching assignments', null, {duration: 5000});
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
            this.assignmentService.setAssignmentAsReadByStudent(assignment.id, this.authService.getUserId()).subscribe((data) => {
                console.log(data);
                if (data) {
                    this.initAssignments();
                }
            });
        }
    }

    uploadTask(assignment: Assignment) {
        // console.log('Upload: ' + assignment);
        // console.log(this.selectedFile);
        const paperImageData = new FormData();
        paperImageData.append('image', this.selectedFile);

        this.assignmentService.uploadStudentPaperImage(paperImageData, assignment.id, this.authService.getUserId()).subscribe(data => {
            console.log('OK');
            this.initAssignments();
            this.snackbar.open('Paper uploaded', null, {duration: 5000});
        }, error => {
            console.log('FAIL');
            this.snackbar.open('Error uploading paper', null, {duration: 5000});
        });

    }

    downloadDelivered(paper: Paper) {
        console.log('Download: ' + paper.id + ' ' + paper.status);
        this.downloadImage(paper.image);
    }

    onFileChanged(event) {
        this.uploadButtonDisabled = true;
        if (event.target.files.length > 0) {
            console.log(event.target.files[0].type);
            if (event.target.files[0].type.startsWith('image/')) {
                this.selectedFile = event.target.files[0];
                this.uploadButtonDisabled = false;
            }
        }
    }

    downloadImage(image: any) {
        const a = document.createElement('a'); // Create <a>
        a.href = image; // Image Base64 Goes here
        a.download = 'Image.png'; // File name Here
        a.click(); // Downloaded file
        a.remove();
    }

    isDownloadable(paper: Paper): boolean {
        if (paper.status === 'NULL' || paper.status === 'READ') {
            return false;
        } else {
            return true;
        }
    }
}
