import {Injectable} from '@angular/core';
import {Assignment} from '../models/assignment.model';
import {Observable, throwError, forkJoin} from 'rxjs';
import {HttpHeaders, HttpClient} from '@angular/common/http';
import {catchError, map, concatMap, flatMap} from 'rxjs/operators';
import {Paper} from '../models/paper.model';
import { Student } from '../models/student.model';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
};

@Injectable({
    providedIn: 'root'
})
export class AssignmentService {

    private API_PATH = 'API/assignments';

    constructor(private http: HttpClient) {
    }

    find(assignmentId: string): Observable<Assignment> {
        /* find assignment (by assignmentId) */
        return this.http
            .get<Assignment>(`${this.API_PATH}/${assignmentId}`)
            .pipe(
                catchError(err => {
                    console.error(JSON.stringify(err));
                    return throwError(`assignmentService.find error: ${err}`);
                })
            );
    }

    queryPapers(assignmentId: string): Observable<any[]> {
        /* get the last papers for the assignment. */
        return this.http
            .get<any>(`${this.API_PATH}/${assignmentId}/papers`)
            .pipe(
                map(data => {
                    /* convert explicitly the result to Paper[] */
                    var papers: any[] = [];
                    if (data !== undefined && data._embedded !== undefined) {
                        data._embedded.paperList.forEach((res) => {
                            const studentLink = res._links.student.href; // http://localhost:8080/API/students/s2"
                            const URLsplit = studentLink.split('/');
                            const studentId = URLsplit[5];
                            let image = 'data:image/jpeg;base64,' + res.image;
                            const paper = new Paper(res.id, null, res.published, res.status, res.flag, res.score, image);
                            papers.push(
                                {paper: paper, studentId: studentId});
                        });
                    }
                    return papers;
                }),
                catchError(err => {
                    console.error(JSON.stringify(err));
                    return throwError(`assignmentService.queryPapers error: ${err}`);
                })
            );

    }

    queryPaperHistory(assignmentId: string, student: Student): Observable<Paper[]> {
        /* get the papers of a student for the assignment */
        return this.http
            .get<any>(`${this.API_PATH}/${assignmentId}/papers/history`, {params: {studentId: student.id}})
            .pipe(
                catchError(err => {
                    console.error(JSON.stringify(err));
                    return throwError(`assignmentService.queryPaperHistory error: ${err}`);
                }),
                map(data => {
                    /* convert explicitly the result to Paper[] */
                    var papers: Paper[] = [];
                    if (data !== undefined && data._embedded !== undefined) {
                        data._embedded.paperList.forEach((paper: Paper) => {
                            let image = 'data:image/jpeg;base64,' + paper.image;
                            papers.push(new Paper(paper.id, student, paper.published, paper.status, paper.flag, paper.score, image));
                        });
                    }
                    return papers;
                })
            );
    }

    setAssignmentAsReadByStudent(assignmentId: string, studentId: string): Observable<boolean> {
        return this.http.post<any>(`${this.API_PATH}/${assignmentId}/students/${studentId}/paperRead`, {}).pipe(catchError(err => {
            console.error(err);
            return throwError(`AssignmentService.setAssignmentAsReadByStudent error: ${err.message}`);
        }));
    }

    uploadStudentPaperImage(paperImage: any, assignmentId: string, studentId: string) {
        return this.http.post<any>(`${this.API_PATH}/${assignmentId}/students/${studentId}/papers`, paperImage)
            .pipe(catchError(err => {
                console.error(err);
                return throwError(`AssignmentService.uploadStudentPaperImage error: ${err.message}`);
            }));

    }

    reviewPaper(assignmentId: string, studentId: string, file: File, score: string, flag: boolean): Observable<void> {
        /* review withouth score --> score = 'NULL', flag = true */
        /* review with score --> score = '...', flag = false */

        // Add fields to prepare the request
        let body = new FormData()
        body.append('image', file, file.name)
        
        const request = {
            studentId: studentId,
            flag: flag,
            score: score
        }  
        const blobRequest = new Blob([JSON.stringify(request)], {type: 'application/json',})

        body.append('request', blobRequest)

        return this.http.post<any>(`${this.API_PATH}/${assignmentId}/paperReview`, body)
            .pipe(
                catchError(err => {
                    return throwError(`AssignmentService.reviewPaper error: ${err.message}`);
                })
            );

    }

}
