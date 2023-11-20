import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from '../Interfaces/User';
import { LoginCredentials } from '../Interfaces/login-credentials';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private apiUrl = 'http://localhost:3000/profile/v1';

  constructor(private http: HttpClient) {

  }

  // Return Observable with user data OR error
  getProfileByUsername(username: string): Observable<any> {
    const url = `${this.apiUrl}/u/${username}`;
    return this.http.get(url);
  }

}
