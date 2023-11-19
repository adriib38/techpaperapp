import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';
import { LoginCredentials } from 'src/app/Interfaces/login-credentials';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  isLoggedIn: boolean | undefined;
  errorMessages: string[] = [];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {

  }

  loginForm = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  submit() {
    console.log(this.loginForm.value);
    
    // Simulate validation
    if (!this.loginForm.valid) {
      return;
    } 

    let loginCredentials: LoginCredentials = {
      email: this.loginForm.value.email || '',
      password: this.loginForm.value.password || ''
    };

    this.login(loginCredentials);
  }

  login(loginCredentials: LoginCredentials): void {
      this.authService.login(loginCredentials).subscribe(
        (data) => {
          console.log('Login exitoso:', data);
          this.authService.saveToken(data.token);
          // Login
          this.router.navigate(['/']);
        },
        (error) => {
          console.error('Error durante el login:', error);
          this.errorMessages = error.error.message;
        }
      );
    
  }

  ngOnInit() {
    console.log("Authenticated: " + this.isLoggedIn);
  }
}