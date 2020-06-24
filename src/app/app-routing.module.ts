import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home.component';
import { StudentsContComponent } from './teacher/students-cont.component';
import { VmsContComponent } from './teacher/vms-cont.component';
import { PageNotFoundComponent } from './page-not-found.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
    { // home
      path: 'home', 
      component: HomeComponent },
    { // redirect to (default route) 'home'
      path: '',   redirectTo: '/home', 
      pathMatch: 'full' }, 
    { 
      path: 'courses',
      canActivate: [AuthGuard],
      children: [
        { 
          path: 'teacher',
          children: [
            { // students 
              path: 'course/applicazioni-internet/students', 
              component: StudentsContComponent 
            },
            { // vms
              path: 'course/applicazioni-internet/vms', 
              component: VmsContComponent 
            }
          ]
        },
        /*{
          path: 'student',
          children: [
            { // vms
              path: 'course/applicazioni-internet/vms', 
              component: VmsContComponent 
            }
          ]
        }*/
      ]  
    },
    { // **
      path: '**', 
      component: PageNotFoundComponent 
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false } )],
  exports: [RouterModule]
})
export class AppRoutingModule { }