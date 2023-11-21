import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private apiUrl = 'http://localhost:3000/profile/v1';

  constructor(private http: HttpClient) {

  }

  // Return Observable with user data OR error
  getProfileByToken(token: string): Observable<any> {
    console.log('token type: ', typeof token);
    const url = `${this.apiUrl}/me`;
    
    //Bearer in the header is the type of authentication
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(url, { headers });

  }

  // Return Observable with user data OR error
  getProfileByUsername(username: string): Observable<any> {
    const url = `${this.apiUrl}/u/${username}`;
    return this.http.get(url);
  }

}
