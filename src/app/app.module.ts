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
import {MatCardModule} from '@angular/material/card';

import { StudentsComponent } from './teacher/students.component';
import { StudentsContComponent } from './teacher/students-cont.component';
import { VmsContComponent } from './teacher/vms-cont.component';
import { HomeComponent } from './home.component'
import { PageNotFoundComponent } from './page-not-found.component';
import { LoginDialogComponent } from './auth/login-dialog.component';

import { AppRoutingModule } from './app-routing.module';

import { HttpClientModule } from '@angular/common/http';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {AuthInterceptor} from './services/auth.interceptor';
import { LoginComponent } from './auth/login.component';

@NgModule({
  declarations: [
    AppComponent,
    StudentsContComponent,
    StudentsComponent,
    VmsContComponent,
    HomeComponent,
    PageNotFoundComponent,
    LoginDialogComponent,
    LoginComponent
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
    MatCardModule
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}],
  bootstrap: [AppComponent],
  entryComponents: [LoginDialogComponent]
})
export class AppModule { }
