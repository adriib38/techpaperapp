import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../../Interfaces/User';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  isLoggedIn: boolean | undefined;
  errorMessages: string[] = [];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {

  }

  registerForm = new FormGroup({
    username: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required)
  });

  submit() {
    console.log(this.registerForm.value);
    
    // Simulate validation
    if (!this.registerForm.valid) {
      return;
    } 

    let user: User = {
      username: this.registerForm.value.username || '',
      name: this.registerForm.value.name || '',
      email: this.registerForm.value.email || '',
      password: this.registerForm.value.password || ''
    };

    this.register(user);
  }

  register(user: User): void {
    this.authService.register(user).subscribe(
      (data) => {
        console.log('Registro exitoso:', data);
        // Login
        this.authService.saveToken(data.token);
        console.log('Login exitoso:', data.token);
        this.router.navigate(['/']);
      },
      (error) => {
        console.error('Error durante el registro:', error);
        this.errorMessages = error.error.message;
      }
    );
  }


}
