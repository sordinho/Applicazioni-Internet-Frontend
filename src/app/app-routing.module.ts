import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home.component';
import { StudentsContComponent } from './teacher/students-cont.component';
import { VmsContComponent } from './teacher/vms-cont.component';
import { PageNotFoundComponent } from './page-not-found.component';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './auth/login.component';

const routes: Routes = [
    {
      // courses
      path: 'courses/:courseId', 
      canActivate: [AuthGuard],
      component: HomeComponent,
      children: [
        { // students 
          path: 'students', 
          component: StudentsContComponent 
        },
        { // vms
          path: 'vms', 
          component: VmsContComponent 
        },
        /*
        { // vm
          path: 'course/applicazioni-internet/vm', 
          component: VmsContComponent 
        }
        */
      ]
    },
    { 
      path: 'courses', 
      canActivate: [AuthGuard],
      component: HomeComponent,
    },
    
    { // redirect to (default route) 'courses'
      path: '',   redirectTo: '/courses', 
      pathMatch: 'full' }, 
    
    { 
      path: 'login', 
      component: LoginComponent },

    { // **
      path: '**', 
      component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false } )],
  exports: [RouterModule]
})
export class AppRoutingModule { }