import {Component, OnInit} from '@angular/core';
import {GroupService} from '../../services/group.service';
import {Group} from '../../models/group.model';

@Component({
    selector: 'app-groups',
    templateUrl: './groups.component.html',
    styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit {

    group: Group = null;

    constructor(private groupService: GroupService) {
    }

    ngOnInit(): void {
        this.initStudentGroup();
    }

    initStudentGroup() {
        this.groupService.getStudentGroup('1234', '1')
            .subscribe((data) => {
                this.group = data;
            });
    }

}
