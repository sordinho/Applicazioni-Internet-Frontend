import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {EMPTY, Observable, of, throwError} from 'rxjs';
import {catchError, map, retry} from 'rxjs/operators';
import {Student} from '../models/student.model';
import {StudentService} from './student.service';
import {Resources} from '../models/resources.model';
import {Team, TEST_GROUP} from '../models/team.model';
import {Vm} from '../models/vm.model';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
};

@Injectable({
    providedIn: 'root'
})
export class GroupService {

    private API_PATH = 'API/teams';

    constructor(private http: HttpClient, private studentService: StudentService) {
    }

    getAllGroups(): Observable<Team[]> {
        return of([TEST_GROUP]);
    }

    getMembers(teamId: string): Observable<Student[]> {
        /* find members (by teamId) */
        return this.http
            .get<any>(`${this.API_PATH}/${teamId}/members`)
            .pipe(
                catchError(err => {
                    console.error(err);
                    return throwError(`GroupService.getMembers error: ${err.message}`);
                }),
                map(data => {
                    /* convert explicitly the result to Student[]: important to be shown in the mat autocomplete (StudentComponent),
                           otherwise it would be shown [Object, Object] */
                    var allStudents: Student[] = [];
                    if (data !== null) {
                        data._embedded.studentList.forEach((student: Student) => {
                            let stud = new Student(student.id, student.lastName, student.firstName, student.email, student.image);
                            // stud.status = 'ACCEPTED'
                            allStudents.push(stud);
                        });
                    }
                    return allStudents;
                }));
    }

    getResources(teamId: string): Observable<Resources> {
        return this.http
            .get<Resources>(`${this.API_PATH}/${teamId}/virtual-machines/resources`)
            .pipe(
                catchError(err => {
                    console.error(err);
                    // return throwError(`GroupService.getResources error: ${err.message}`);
                    return of(null);
                }), map(data => {
                    return data;
                })
            );
    }

    getMembersStatus(teamId: string): Observable<Student[]> {
        return this.http.get<any>(`${this.API_PATH}/${teamId}/members/status-list`)
            .pipe(
                catchError(err => {
                    console.error(err);
                    return throwError(`GroupService.getMembersStatus error: ${err.message}`);
                }),
                map(data => {
                        // return data;
                        // console.log(JSON.stringify(data));
                        /* convert explicitly the result to Student[]: important to be shown in the mat autocomplete (StudentComponent),
                               otherwise it would be shown [Object, Object] */
                        let status: Student[] = [];
                        // let status: Map<string, string> = new Map<string, string>(data);
                        if (data !== null) {
                            data.forEach((studStat: any) => {
                                let studentData = studStat.student;
                                let stud = new Student(studentData.id, studentData.lastName, studentData.firstName, studentData.email, null);
                                stud.status = studStat.status;
                                // console.log(studentData);
                                // console.log(stud.toString());
                                status.push(stud);
                            });
                        }
                        return status;
                    }
                ));
    }

    getVms(teamId: string): Observable<Vm[]> {
        return this.http.get<any>(`${this.API_PATH}/${teamId}/virtual-machines`).pipe(
            catchError(err => {
                console.error(err);
                return throwError(`GroupService.getVms error: ${err.message}`);
            }),
            map(data => {
                    // console.log(JSON.stringify(data));
                    let vms: Vm[] = [];
                    if (data !== undefined && data._embedded !== undefined) {
                        data._embedded.virtualMachineList.forEach((vmData: any) => {
                            let vm: Vm = new Vm(vmData.id, vmData.num_vcpu, vmData.ram, vmData.disk_space, vmData.studentId);
                            vm.status = vmData.status;
                            vms.push(vm);
                        });
                    }
                    return vms;
                }
            ));
    }
}

