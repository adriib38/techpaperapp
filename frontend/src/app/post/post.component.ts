import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router' 
import { PostService } from '../services/post.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  authToken = '';
  postId = '';


  constructor(
    private authService: AuthService,
    private postService: PostService,
    private router: Router
  ) {
    this.postId = this.router.url.split('/')[2];
  }

  ngOnInit(): void {
    // Get the auth token
    this.authToken = this.authService.getAuthToken() ?? '';

    this.postService.getPostById(this.postId, this.authToken).subscribe(
      (data) => {
        console.log('Post exitoso:', data);
        document.body.innerHTML += JSON.stringify(data);
      },
      (error) => {
        console.error('Error obteniendo el post:', error);
        document.body.innerHTML += JSON.stringify(error);
      });
}
}