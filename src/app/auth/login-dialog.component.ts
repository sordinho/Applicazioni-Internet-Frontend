import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.css']
})
export class LoginDialogComponent implements OnInit {
  
  email = new FormControl('', { 
    updateOn: 'blur', 
    validators: [Validators.required, Validators.email] 
  });
  password = new FormControl('', { 
    updateOn: 'blur', 
    validators: [Validators.required, Validators.minLength(6)] 
  });

  loginError = false;
  
  constructor(private dialogRef: MatDialogRef<LoginDialogComponent>, private authService: AuthService) { }

  ngOnInit(): void {
  }

  cancel() {
    this.dialogRef.close(false);
  }

  login() {
    //console.log("email: " + this.email.value);
    //console.log("pass: " + this.password.value);
    if(!this.email.invalid && !this.password.invalid){
      this.authService.loginUser(this.email.value, this.password.value)
                      .subscribe(
                        suc => {
                          //console.dir("LoginDialogComponent - .subscribe (success) - result.accessToken: " + suc.accessToken);
                          this.dialogRef.close(true);
                        },
                        err => {
                          //console.dir(".subscribe (error) - result.accessToken: " + err.accessToken);
                          this.loginError = true;
                          this.password.reset();
                        }
                      );
    }
  }

  getEmailErrorMessage() {
    if (this.email.hasError('required')) {
      return 'Email is required';
    } else if(this.email.hasError('email')) {
      return 'Email is invalid';
    } else {
      return '';
    }
  }

  getPasswordErrorMessage() {
    if (this.password.hasError('required')) {
      return 'Password is required';
    } else if(this.password.hasError('minlength')) {
      return 'Password must be at least 6 characters';
    } else {
      return '';
    }
  }

}