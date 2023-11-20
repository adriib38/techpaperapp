import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from '../Interfaces/User';
import { LoginCredentials } from '../Interfaces/login-credentials';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();

  private apiUrl = 'http://localhost:3000/auth/v1';

  constructor(private http: HttpClient) {
    this.checkAuthenticationStatus();
  }

  // Return Observable with user data OR error
  register(user: User): Observable<any> {
    let body = {
      username: user.username,
      name: user.name,
      email: user.email,
      password: user.password
    };

    console.log('body', body);

    const url = `${this.apiUrl}/signup`;
    return this.http.post(url, body);
  }

  login(credentials: LoginCredentials): Observable<any> {
    let body = {
      email: credentials.email,
      password: credentials.password
    };

    const url = `${this.apiUrl}/signin`;
    return this.http.post(url, body);
  }

  saveToken(token: string): void {
    localStorage.setItem('authToken', token);
    this.isAuthenticatedSubject.next(true);
  }

  logout(): void {
    // Remove token from local storage
    localStorage.removeItem('authToken');
    
    this.isAuthenticatedSubject.next(false);
  }

  private checkAuthenticationStatus(): void {
    // Verificar si hay un token almacenado al inicializar el servicio
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      this.isAuthenticatedSubject.next(true);
    }
  }

}
