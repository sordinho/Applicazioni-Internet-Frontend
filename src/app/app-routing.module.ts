import {NgModule, Component} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {HomeComponent} from './home.component';
import {StudentsContComponent} from './teacher/students/students-cont.component';
import {VmsComponent} from './teacher/vms/vms.component';
import {PageNotFoundComponent} from './page-not-found.component';
import {AuthGuard} from './auth/auth.guard';
import {LoginComponent} from './auth/login.component';
import { VmComponent } from './student/vm/vm.component';
import { AssigmentsComponent } from './teacher/assigments/assigments.component';
import { GroupsComponent } from './student/groups/groups.component';
import { DeliveriesComponent } from './student/deliveries/deliveries.component';

const routes: Routes = [
    {
        // courses
        path: 'courses/:courseId',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: HomeComponent,
        children: [
            /* teacher */
            { // students
                path: 'students',
                component: StudentsContComponent
            },
            { // vms
                path: 'vms',
                component: VmsComponent
            },
            { // assignments
                path: 'assignments',
                component: AssigmentsComponent
            },
            /* student */
            { // group
                path: 'groups',
                component: GroupsComponent
            },
            { // vm
                path: 'vm',
                component: VmComponent
            },
            { // deliveries
                path: 'deliveries',
                component: DeliveriesComponent
            }
        ]
    },
    {
        path: 'courses',
        canActivate: [AuthGuard],
        component: HomeComponent,
    },

    { // redirect to (default route) 'courses'
        path: '', redirectTo: '/courses',
        pathMatch: 'full'
    },

    {
        path: 'login',
        component: LoginComponent
    },

    { // **
        path: '**',
        component: PageNotFoundComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {enableTracing: false})],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
