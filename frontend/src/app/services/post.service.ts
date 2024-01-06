import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = 'http://localhost:3000/post/v1';

  constructor(
    private http: HttpClient
  ) {

  }

  getAllPosts(token: string): Observable<any> {
    const url = `${this.apiUrl}/`;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(url, { headers });
  }

  getPostsByUsername(username: string, token: string): Observable<any> {
    const url = `${this.apiUrl}/user/${username}`;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(url, { headers });
  }

  getWallByToken(token: string): Observable<any> {
    const url = `${this.apiUrl}/wall`;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(url, { headers });
  }

  getPostById(id: string, token: string): Observable<any> {
    const url = `${this.apiUrl}/posts/${id}`;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(url, { headers });
  }

  deletePostById(id: string, token: string): Observable<any> {
    const url = `${this.apiUrl}/posts/${id}`;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(url, { headers });
  }

  createPost(post: any, token: string): Observable<any> {
    let body = {
      title: post.title,
      content: post.content,
      categories: 'AA'
    };

    const url = `${this.apiUrl}/`;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(url, body, { headers });
  }
}
