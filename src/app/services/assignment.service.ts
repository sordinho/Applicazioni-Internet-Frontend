import { Injectable } from '@angular/core';
import { Assignment } from '../models/assignment.model';
import { Observable, throwError, forkJoin } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { catchError, map, concatMap, flatMap } from 'rxjs/operators';
import { Paper } from '../models/paper.model';

const httpOptions = {
  headers: new HttpHeaders({
      'Content-Type': 'application/json'
  })
}

@Injectable({
  providedIn: 'root'
})
export class AssignmentService {

  private API_PATH = 'API/assignments'

  constructor(private http: HttpClient) { }

  find(assignmentId: string): Observable<Assignment> {
    /* find assignment (by assignmentId) */
    return this.http
                .get<Assignment>(`${this.API_PATH}/${assignmentId}`)
                .pipe(
                  catchError( err => {
                      console.error(JSON.stringify(err));
                      return throwError(`assignmentService.find error: ${err}`);
                  })
                )
  }

  queryPapers(assignmentId: string): Observable<any[]> {
    console.dir("queryPapers: " + assignmentId)
    /* get the last papers for the assignment. */
    return this.http
                .get<any>(`${this.API_PATH}/${assignmentId}/papers`)
                .pipe(
                  catchError( err => {
                      console.error(JSON.stringify(err));
                      return throwError(`assignmentService.queryPapers error: ${err}`);
                  }),
                  map(data => {
                    /* convert explicitly the result to Paper[] */
                    var papers: any[] = [];
                    if (data !== undefined && data._embedded !== undefined) {
                        data._embedded.paperList.forEach((res) => {
                          const studentLink = res._links.student.href // http://localhost:8080/API/students/s2"
                          const URLsplit = studentLink.split('/')
                          const studentId = URLsplit[5]
                          const paper = new Paper(res.id, null, res.published, res.status, res.flag, res.score, res.image)
                          papers.push(
                            { paper: paper, studentId: studentId })
                        })
                    }
                    return papers;
                  })
                )

  }

  queryPaperHistory(assignmentId: string, studentId: string): Observable<Paper[]> {
    /* get the papers of a student for the assignment */
    return this.http
                .get<any>(`${this.API_PATH}/${assignmentId}/papers/history`, { params: { studentId: studentId } })
                .pipe(
                  catchError( err => {
                      console.error(JSON.stringify(err));
                      return throwError(`assignmentService.queryPaperHistory error: ${err}`);
                  }),
                  map(data => {
                    /* convert explicitly the result to Paper[] */
                    var papers: Paper[] = [];
                    if (data !== undefined && data._embedded !== undefined) {
                        data._embedded.paperList.forEach((paper: Paper) => {
                            papers.push(new Paper(paper.id, null /* not required */, paper.published, paper.status, paper.flag, paper.score, paper.image))
                        })
                    }
                    return papers;
                  })
                )
  }

}
