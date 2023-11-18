import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from '../Interfaces/User';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();

  private apiUrl = 'http://localhost:3000/auth/v1';

  constructor(private http: HttpClient) {

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

  login(): void {
    this.isAuthenticatedSubject.next(true);
  }

  logout(): void {
    this.isAuthenticatedSubject.next(false);
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }
}
