import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AuthService, UserInformation } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  file: File
  defaultFilename = 'No file chosen'
  filename: string

  fileError = false
  errorMessage: string

  id = new FormControl('s01', {
    updateOn: 'blur',
    validators: [Validators.required]
  });

  email = new FormControl('s01@studenti.polito.it', {
    updateOn: 'blur',
    validators: [Validators.required, Validators.email]
  });
  
  lastName = new FormControl('Sinagra', {
    updateOn: 'blur',
    validators: [Validators.required]
  });

  firstName = new FormControl('Simone', {
    updateOn: 'blur',
    validators: [Validators.required]
  });

  generalErrorMessage: string

  /** Password must be:
    * At least 8 chars
    * Contains at least one digit
    * Contains at least one lower alpha char and one upper alpha char
    * Contains at least one char within a set of special chars (@#%$^ etc.)
    * Does not contain space, tab, etc.
    * */
  password = new FormControl('Password1#', {
    updateOn: 'blur',
    validators: [Validators.required, Validators.minLength(8), Validators.pattern("^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[@#$%^&+=])([a-zA-Z0-9@#$%^&+=]+)$")]
  })

  repeatPassword = new FormControl('Password1#', {
    updateOn: 'blur',
    validators: [Validators.required]
  });

  loading = false;
  registerError = false;
  redirectUrl: string;

  constructor(private route: ActivatedRoute, private router: Router, private authService: AuthService) {
    this.redirectUrl = this.route.snapshot.queryParams['redirect_to'] || '/';

    // redirect to redirectUrl if already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate([this.redirectUrl]);
    }
  }

  ngOnInit(): void {
    this.filename = this.defaultFilename
  }

  fileChange(files: any) {
    //console.dir("fileChange - files: " + JSON.stringify(files))
    // when the load event is fired and the file not empty
    if(files && files.length > 0) {
      // Fill file variable with the file content
      this.fileError = false
      this.file = files[0]
      this.filename = this.file.name
    }

  }

  register() {
    this.registerError = false
    this.generalErrorMessage = ''

    if(this.password.value !== this.repeatPassword.value) {
      this.registerError = true
      this.generalErrorMessage = "passwords must be equal" 
      this.password.reset()
      this.repeatPassword.reset()
    } else if(this.id.valid && this.email.valid && this.lastName.valid && this.firstName.valid && this.password.valid && this.repeatPassword.valid && this.file !== undefined){
      this.loading = true;

      //console.dir("id: " + this.id.value + " email: " + this.email.value + " lastName: " + this.lastName.value + " fistName: " + this.firstName.value + " password: " + this.password.value + " repeatPassword: " + this.repeatPassword.value)
      this.authService.registerUser(new UserInformation(this.id.value, this.email.value, this.lastName.value, this.firstName.value, this.password.value, this.repeatPassword.value), this.file)
                      .subscribe(
                        suc => {
                          //console.dir("LoginComponent - .subscribe (success) - result.accessToken: " + suc.accessToken);
                          this.router.navigate([this.redirectUrl]);
                        },
                        err => {
                          //console.dir(".subscribe (error) - result.accessToken: " + err.accessToken);
                          this.loading = false
                          this.registerError = true
                          this.generalErrorMessage = err
                          this.password.reset()
                          this.repeatPassword.reset()
                        }
                      );
    } else {
      this.id.markAsTouched({onlySelf: true})
      this.email.markAsTouched({onlySelf: true})
      this.lastName.markAsTouched({onlySelf: true})
      this.firstName.markAsTouched({onlySelf: true})
      this.password.markAsTouched({onlySelf: true})
      this.repeatPassword.markAsTouched({onlySelf: true})
      if(this.file === undefined) {
        this.fileError = true
        this.errorMessage = "Image is required"
      }
    }
  }

  getIdErrorMessage() {
    if (this.email.hasError('required')) {
      return 'Id is required';
    } else {
      return '';
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

  getLastNameErrorMessage() {
    if (this.email.hasError('required')) {
      return 'Last name is required';
    } else {
      return '';
    }
  }

  getFirstNameErrorMessage() {
    if (this.email.hasError('required')) {
      return 'First name is required';
    } else {
      return '';
    }
  }

  getPasswordErrorMessage() {
    if (this.password.hasError('required')) {
      return 'Password is required';
    } else if(this.password.hasError('minlength')) {
      return 'Password must be at least 8 characters';
    } else if(this.password.hasError('pattern')) {
      return 'Password must have 1+ digit, lower and upper char, special char'
    } else {
      return '';
    }
  }

  getRepeatPasswordErrorMessage() {
    if (this.email.hasError('required')) {
      return 'Repeat password is required';
    } else {
      return '';
    }
  }
  
}