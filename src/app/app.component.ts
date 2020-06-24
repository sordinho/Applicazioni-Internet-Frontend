import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { LoginDialogComponent } from './auth/login-dialog.component';
import { AuthService } from './auth/auth.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy{
  title = 'VirtualLabs';
  @ViewChild('sidenav') sidenav: MatSidenav;

  loggedIn = this.authService.isLoggedIn(); 
  
  paramMapSub: Subscription;
  email = this.authService.getEmail();
  
  navLinks = [
    { path: 'students', label: 'Students' },
    { path: 'vms', label: 'VMs' },
    { path: 'assignments', label: 'Assignments' }
  ];

  constructor(private dialogLogin: MatDialog, private authService: AuthService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.paramMapSub = this.route.queryParamMap.subscribe( (params: ParamMap) => {
                                                              const doLogin = params.get('doLogin');
                                                              if(doLogin && this.authService.isLoggedOut()) {
                                                                this.openLoginDialog();
                                                              }
                                                            });
                                                          
  }

  ngOnDestroy() {
    if(this.paramMapSub != undefined) {
      console.dir("AppComponent - ngOnDestroy() - this.paramMapSub.unsubscribe()");
      this.paramMapSub.unsubscribe();
    }
  }

  toggleForMenuClick() {
    this.sidenav.toggle();
  }
  
  openLoginDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "400px";
    
    const dialogRef = this.dialogLogin.open(LoginDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(success => {
      if(success && this.authService.isLoggedIn()) {
        this.loggedIn = true;
      } else {
        // user pressed cancel
        this.router.navigate(['/home']);
      }
    });
  }

  login() {
    this.authService.redirectUrl = "/home";
    this.router.navigate(['/home'], { queryParams: { doLogin: true } });
  }

  logout() {
    this.authService.logout()
    if(this.authService.isLoggedOut()) {
      this.loggedIn = false;
      this.router.navigateByUrl('/home');
    }
  }

  getEmail() {
    return this.authService.getEmail();
  }

}