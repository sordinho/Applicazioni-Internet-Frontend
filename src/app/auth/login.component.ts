import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email = new FormControl('olivier@mail.com', { 
    updateOn: 'blur', 
    validators: [Validators.required, Validators.email] 
  });
  password = new FormControl('bestPassw0rd', { 
    updateOn: 'blur', 
    validators: [Validators.required, Validators.minLength(6)] 
  });
  
  loginError = false;
  
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  login() {
    //console.log("email: " + this.email.value);
    //console.log("pass: " + this.password.value);
    if(!this.email.invalid && !this.password.invalid){
      this.authService.loginUser(this.email.value, this.password.value)
                      .subscribe(
                        suc => {
                          //console.dir("LoginDialogComponent - .subscribe (success) - result.accessToken: " + suc.accessToken);
                        },
                        err => {
                          //console.dir(".subscribe (error) - result.accessToken: " + err.accessToken);
                          this.loginError = true;
                          this.password.reset();
                        }
                      );
    } else {
      this.email.markAsTouched({onlySelf: true});
      this.password.markAsTouched({onlySelf: true});
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
