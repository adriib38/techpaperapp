import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from '../Interfaces/User';
import { LoginCredentials } from '../Interfaces/login-credentials';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();

  // Token
  private authTokenSubject = new BehaviorSubject<string | null>(
    this.getStoredAuthToken()
  );

  public authToken$: Observable<string | null> = this.authTokenSubject.asObservable();
    
  private apiUrl = 'http://localhost:3000/auth/v1';
  
  constructor(
    private http: HttpClient,
    private router: Router
  ) {

    this.checkAuthenticationStatus();

  }

  // Return Observable with user data OR error
  register(user: User): Observable<any> {
    let body = {
      username: user.username,
      name: user.name,
      email: user.email,
      password: user.password,
    };

    console.log('body', body);

    const url = `${this.apiUrl}/signup`;
    return this.http.post(url, body);
  }

  login(credentials: LoginCredentials): Observable<any> {
    let body = {
      email: credentials.email,
      password: credentials.password,
    };

    const url = `${this.apiUrl}/signin`;

    return this.http.post(url, body);
  }

  logout(): void {
    // Remove token from local storage
    localStorage.removeItem('authToken');
    this.isAuthenticatedSubject.next(false);
  }

  saveToken(token: string): void {
    localStorage.setItem('authToken', token);
    this.isAuthenticatedSubject.next(true);
  }

  // Set token in local storage
  setAuthToken(token: string | null): void {
    if (token) {
      localStorage.setItem('authToken', token);
      this.isAuthenticatedSubject.next(true);
    } else {
      localStorage.removeItem('authToken');
      this.isAuthenticatedSubject.next(false);
    }
    this.authTokenSubject.next(token);
  }  

  // Get token from local storage
  getAuthToken(): string | null {
    if (this.authTokenSubject) {
      return this.authTokenSubject.value;
    } else {
      console.warn('No token found');
      //Redirect to login
      this.router.navigate(['/login']);
      return null;
    }
  }

  private getStoredAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  redirectToLoginIfNotAuthenticated(): void {
    if (!this.getAuthToken()) {
      this.router.navigate(['/login']);
    }
  }

  private checkAuthenticationStatus(): void {
    // Verificar si hay un token almacenado al inicializar el servicio
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      this.isAuthenticatedSubject.next(true);
    } else {
      this.isAuthenticatedSubject.next(false);
    }
  }
}
