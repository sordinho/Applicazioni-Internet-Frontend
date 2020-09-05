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
    courseId: string = '';
    dataFetched = false;
    imageTest: any;


    assignments: Assignment[] = [
        new Assignment('A0', '01/01/2020', '31/01/2020', null),
        new Assignment('A1', '01/03/2020', '31/03/2020', null)
    ];

    papers = new Map<string, Paper[]>();

    /* [
     ['A0', [new Paper('P0', new Student('902030', '260342', 'Andrea', 'Rossi'), '15/01/2020', 'null', null, null, null),
         new Paper('P1', new Student('902030', '260342', 'Francesco', 'Verdi'), '10/01/2020', 'null', null, null, null),
         new Paper('P2', new Student('902030', '260342', 'Stefano', 'Gialli'), '12/01/2020', 'null', null, null, null)]],
     ['A1', [new Paper('P0', new Student('902030', '260342', 'Andrea', 'Rossi'), '15/01/2020', 'null', null, null, null),
         new Paper('P1', new Student('902030', '260342', 'Francesco', 'Verdi'), '10/01/2020', 'read', null, null, null),
         new Paper('P2', new Student('902030', '260342', 'Stefano', 'Gialli'), '12/01/2020', 'read', null, null, null),
         new Paper('P3', new Student('902022', '260332', 'Simone', 'Gallo'), '10/01/2020', 'delivered', null, null, null)]]
 ]);*/

    constructor(private courseService: CourseService, private studentService: StudentService, private authService: AuthService, private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.courseId = this.route.snapshot.parent.url[1].toString();
        this.initAssignments();
        // this.dataSource = new MatTableDataSource<Assignment>(this.assignments);
    }

    initAssignments() {
        // Get all assignments
        this.courseService.queryAllAssigments(this.courseId).subscribe((data) => {
            this.assignments = data;
            this.dataSource = new MatTableDataSource<Assignment>(this.assignments);

            let assignmentCounter = 0;
            this.assignments.forEach((assignment) => {
                this.studentService.getPapersByAssignment(this.authService.getUserId(), assignment.id).subscribe((paperList) => {
                    this.papers.set(assignment.id, paperList);
                    assignmentCounter++;
                    this.dataFetched = assignmentCounter === this.assignments.length;
                });
            });


            // this.dataFetched = true;
        });
    }

    downloadAssignment(event: any, assignment: Assignment) {
        event.stopPropagation();
        console.log('Download: ' + assignment);

        // const blob = new Blob([assignment.image], {type: 'image/png'});

        // console.log(assignment.image);
        //
        // this.imageTest = 'data:image/png;base64,' + Base64.encode(assignment.image);

        const fileURL = window.URL.createObjectURL(assignment.image);
        window.open(fileURL, '_blank');

        // URL.revokeObjectURL(fileURL);
    }

    uploadTask(assignment: any) {
        console.log('Upload: ' + assignment);
    }

    downloadDelivered(paper: Paper) {
        console.log('Download: ' + paper.id + ' ' + paper.status);
    }
}
