import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  isLoggedIn: boolean | undefined;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.isLoggedIn = authService.isAuthenticated();
  }

  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  submit() {
    console.log(this.loginForm.value);
    
    // Simulate validation
    if (!this.loginForm.valid) {
      return;
    } 

    this.login();
  }

  login() {
    this.authService.login();
    this.isLoggedIn = true;
    this.router.navigate(['/']);
  }

  ngOnInit() {
    console.log("Authenticated: " + this.isLoggedIn);
  }
}