import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from "@angular/material/paginator";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatDialogModule } from "@angular/material/dialog";
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { StudentsComponent } from './teacher/students/students.component';
import { StudentsContComponent } from './teacher/students/students-cont.component';
import { VmsComponent } from './teacher/vms/vms.component';
import { HomeComponent } from './home/home.component'
import { PageNotFoundComponent } from './page-not-found.component';

import { AppRoutingModule } from './app-routing.module';

import { HttpClientModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './services/auth.interceptor';
import { LoginComponent } from './auth/login/login.component';
import { VmComponent } from './student/vm/vm.component';
import { GroupsComponent } from './student/groups/groups.component';
import { DeliveriesComponent } from './student/deliveries/deliveries.component';
import { AssigmentsComponent } from './teacher/assigments/assigments.component';
import { RegisterComponent } from './auth/register/register.component';
import { NewCourseDialogComponent } from './dialogs/new-course-dialog/new-course-dialog.component';
import { EditCourseDialogComponent } from './dialogs/edit-course-dialog/edit-course-dialog.component';
import { DeleteCourseDialogComponent } from './dialogs/delete-course-dialog/delete-course-dialog.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatBadgeModule } from '@angular/material/badge';
import { ShareDialogComponent } from './student/vm/share-dialog.component';
import { CreateVmDialogComponent } from './student/vm/create-vm-dialog.component';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { UploadCorrectionDialogComponent } from './dialogs/upload-correction-dialog/upload-correction-dialog.component';
import { HomeContComponent } from './home/home-cont.component';
import { AssigmentsContComponent } from './teacher/assigments/assigments-cont.component';


@NgModule({
  declarations: [
    AppComponent,
    StudentsContComponent,
    StudentsComponent,
    VmsComponent,
    AssigmentsComponent,
    GroupsComponent,
    VmComponent,
    DeliveriesComponent,
    HomeComponent,
    PageNotFoundComponent,
    LoginComponent,
    RegisterComponent,
    NewCourseDialogComponent,
    EditCourseDialogComponent,
    DeleteCourseDialogComponent,
    ShareDialogComponent,
    CreateVmDialogComponent,
    UploadCorrectionDialogComponent,
    HomeContComponent,
    AssigmentsContComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatTabsModule,
    MatTableModule,
    MatCheckboxModule,
    MatButtonModule,
    MatInputModule,
    MatAutocompleteModule,
    MatSortModule,
    MatPaginatorModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatCardModule,
    MatMenuModule,
    MatGridListModule,
    MatExpansionModule,
    MatBadgeModule,
    MatSelectModule,
    MatTooltipModule,
    MatChipsModule,
    MatSnackBarModule,
    MatSlideToggleModule
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
